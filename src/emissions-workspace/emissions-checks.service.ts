import { HttpStatus, Injectable } from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

import { EmissionsImportDTO } from '../dto/emissions.dto';
import { MonitorLocationChecksService } from '../monitor-location-workspace/monitor-location-checks.service';
import { WeeklyTestSummaryCheckService } from '../weekly-test-summary-workspace/weekly-test-summary-check.service';
import { DailyTestSummaryCheckService } from '../daily-test-summary-workspace/daily-test-summary-check.service';
import { isUndefinedOrNull } from '../utils/utils';
import { MonitorFormulaRepository } from '../monitor-formula/monitor-formula.repository';
import { MonitorPlanChecksService } from '../monitor-plan-workspace/monitor-plan-checks.service';
import { MonitorLocation } from '../entities/monitor-location.entity';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions/easey.exception';
import { CodeChecksService } from '../code-checks/code-checks.service';
import { SummaryValueDataCheckService } from '../summary-value-workspace/summary-value-data-check.service';

const moment = require('moment');

@Injectable()
export class EmissionsChecksService {
  constructor(
    private readonly logger: Logger,
    private readonly weeklyTestSummaryCheckService: WeeklyTestSummaryCheckService,
    private readonly dailyTestSummaryCheckService: DailyTestSummaryCheckService,
    private readonly summaryValueDataCheckService: SummaryValueDataCheckService,
    private readonly monitorLocationCheckService: MonitorLocationChecksService,
    private readonly monitorPlanCheckService: MonitorPlanChecksService,
    private readonly codeCheckService: CodeChecksService,
    private readonly monitorFormulaRepository: MonitorFormulaRepository,
  ) {
    this.logger.setContext('EmissionsChecksService');
  }
  public throwIfErrors(errorList: string[]) {
    if (errorList.length > 0) {
      throw new EaseyException(
        new Error(errorList.toString()),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async runChecks(payload: EmissionsImportDTO): Promise<string[]> {
    this.logger.log('Running Emissions Import Checks');

    const errorList: string[] = [];

    const doesNotHaveData = d => isUndefinedOrNull(d) || d.length === 0;

    if (
      doesNotHaveData(payload.dailyEmissionData) &&
      doesNotHaveData(payload.weeklyTestSummaryData) &&
      doesNotHaveData(payload.summaryValueData) &&
      doesNotHaveData(payload.dailyTestSummaryData) &&
      doesNotHaveData(payload.hourlyOperatingData) &&
      doesNotHaveData(payload.longTermFuelFlowData) &&
      doesNotHaveData(payload.nsps4tSummaryData) &&
      doesNotHaveData(payload.dailyBackstopData)
    ) {
      this.throwIfErrors(['No data found in payload']);
    }

    const codeErrors = await this.codeCheckService.runChecks(payload);

    // IMPORT-29: Inappropriate Children Records for Daily Test Summary
    const dailyTestSummaryCheckErrors = this.dailyTestSummaryCheckService.runChecks(
      payload,
    );

    const weeklyTestSummaryCheckErrors = this.weeklyTestSummaryCheckService.runChecks(
      payload,
    );

    const summaryValueDataCheckErrors = this.summaryValueDataCheckService.runChecks(
      payload,
    );

    const invalidDatesCheckErrors = this.invalidDatesCheck(payload);

    // IMPORT-27: All EM Components Present in the Production Database
    // IMPORT-26: All EM Systems Present in the Production Database
    const [
      unitStackIdentifiers,
      locationErrors,
    ] = await this.monitorLocationCheckService.runChecks(payload);

    // IMPORT-22: All EM Locations Present in Unique Monitoring Plan in the Production Database
    const monitorPlanCheckErrors = await this.monitorPlanCheckService.runChecks(
      unitStackIdentifiers,
    );

    errorList.push(
      ...codeErrors,
      ...weeklyTestSummaryCheckErrors,
      ...summaryValueDataCheckErrors,
      ...invalidDatesCheckErrors,
      ...locationErrors,
      ...dailyTestSummaryCheckErrors,
      ...monitorPlanCheckErrors,
    );

    this.throwIfErrors(errorList);
    this.logger.log('Completed Emissions Import Checks');

    return errorList;
  }

  async invalidFormulasCheck(
    payload: EmissionsImportDTO,
    monitoringLocations: MonitorLocation[],
  ): Promise<void> {
    const identifierMap = new Map<string, Set<string>>();

    payload?.hourlyOperatingData?.forEach(hourlyOp => {
      const monitoringLocationId = monitoringLocations.filter(location => {
        return (
          location.unit?.name === hourlyOp.unitId ||
          location.stackPipe?.name === hourlyOp.stackPipeId
        );
      })[0].id;

      if (!identifierMap.has(monitoringLocationId)) {
        identifierMap.set(monitoringLocationId, new Set());
      }

      hourlyOp?.derivedHourlyValueData?.forEach(derived => {
        if (!isUndefinedOrNull(derived.formulaId)) {
          identifierMap.set(
            monitoringLocationId,
            identifierMap.get(monitoringLocationId).add(derived.formulaId),
          );
        }
      });

      hourlyOp?.matsDerivedHourlyValueData?.forEach(matsDerived => {
        if (!isUndefinedOrNull(matsDerived.formulaId)) {
          identifierMap.set(
            monitoringLocationId,
            identifierMap.get(monitoringLocationId).add(matsDerived.formulaId),
          );
        }
      });

      hourlyOp?.hourlyFuelFlowData?.forEach(fuelFlow => {
        fuelFlow?.hourlyParameterFuelFlowData?.forEach(paramFuelFlow => {
          if (!isUndefinedOrNull(paramFuelFlow.formulaId)) {
            identifierMap.set(
              monitoringLocationId,
              identifierMap
                .get(monitoringLocationId)
                .add(paramFuelFlow.formulaId),
            );
          }
        });
      });
    });

    const errorList: string[] = [];

    for (const [key, value] of identifierMap) {
      const monitorFormulas = await this.monitorFormulaRepository.find({
        where: { monitoringLocationId: key },
      });
      const validFormulas = new Set(monitorFormulas.map(mf => mf.formulaId));
      for (const formula of Array.from(value)) {
        if (!validFormulas.has(formula)) {
          const errorMessage = CheckCatalogService.formatResultMessage(
            'IMPORT-28-A',
            {
              formulaID: formula,
            },
          );
          errorList.push(errorMessage);
          this.throwIfErrors(errorList);
        }
      }
    }
  }

  // IMPORT-23: Emission File Dates Valid
  invalidDatesCheck(payload: EmissionsImportDTO): string[] {
    let earliestDate: number;
    let latestDate: number;

    const dateCheck = (date: Date) => {
      if (isUndefinedOrNull(date)) {
        return;
      }

      const year = moment(date).year();
      const quarter = moment(date).quarter();
      const combo = Number(`${year}${quarter}`);

      if (typeof earliestDate === 'undefined' || combo < earliestDate) {
        earliestDate = combo;
      }

      if (typeof latestDate === 'undefined' || combo > latestDate) {
        latestDate = combo;
      }
    };

    payload.dailyEmissionData?.forEach(datum => {
      dateCheck(datum.date);
    });

    payload.dailyTestSummaryData?.forEach(datum => {
      dateCheck(datum.date);
    });

    payload.hourlyOperatingData?.forEach(datum => {
      dateCheck(datum.date);
    });

    payload.sorbentTrapData?.forEach(datum => {
      dateCheck(datum.beginDate);
      dateCheck(datum.endDate);
    });

    payload.weeklyTestSummaryData?.forEach(datum => {
      dateCheck(datum.date);
    });

    const payloadCombo = Number(`${payload.year}${payload.quarter}`);

    if (payloadCombo < earliestDate || payloadCombo > latestDate) {
      return [CheckCatalogService.formatResultMessage('IMPORT-23-A')];
    }

    return [];
  }
}
