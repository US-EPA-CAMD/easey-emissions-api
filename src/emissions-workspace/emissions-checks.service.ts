import { HttpStatus, Injectable } from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

import { EmissionsImportDTO } from '../dto/emissions.dto';
import { MonitorLocationChecksService } from '../monitor-location-workspace/monitor-location-checks.service';
import { WeeklyTestSummaryCheckService } from '../weekly-test-summary-workspace/weekly-test-summary-check.service';
import { DailyTestSummaryCheckService } from '../daily-test-summary-workspace/daily-test-summary-check.service';
import { isUndefinedOrNull } from '../utils/utils';
import { MonitorFormulaRepository } from '../monitor-formula/monitor-formula.repository';
import { MonitorPlanChecksService } from '../monitor-plan-workspace/monitor-plan-checks.service';
import moment from 'moment';

@Injectable()
export class EmissionsChecksService {
  constructor(
    private readonly logger: Logger,
    private readonly weeklyTestSummaryCheckService: WeeklyTestSummaryCheckService,
    private readonly dailyTestSummaryCheckService: DailyTestSummaryCheckService,
    private readonly monitorLocationCheckService: MonitorLocationChecksService,
    private readonly monitorPlanCheckService: MonitorPlanChecksService,
    private readonly monitorFormulaRepository: MonitorFormulaRepository,
  ) {}
  public throwIfErrors(errorList: string[]) {
    if (errorList.length > 0) {
      throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
    }
  }

  async runChecks(payload: EmissionsImportDTO): Promise<string[]> {
    this.logger.info('Running Emissions Import Checks');

    const errorList: string[] = [];

    // IMPORT-29: Inappropriate Children Records for Daily Test Summary
    const dailyTestSummaryCheckErrors = this.dailyTestSummaryCheckService.runChecks(
      payload,
    );

    const weeklyTestSummaryCheckErrors = this.weeklyTestSummaryCheckService.runChecks(
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
      ...weeklyTestSummaryCheckErrors,
      ...invalidDatesCheckErrors,
      ...locationErrors,
      ...dailyTestSummaryCheckErrors,
      ...monitorPlanCheckErrors,
    );

    this.throwIfErrors(errorList);
    this.logger.info('Completed Emissions Import Checks');

    return errorList;
  }

  async invalidFormulasCheck(
    payload: EmissionsImportDTO,
    monitoringLocationId: string,
  ): Promise<void> {
    const formulaIdentifiers = new Set<string>();

    payload?.hourlyOperatingData?.forEach(hourlyOp => {
      hourlyOp?.derivedHourlyValueData?.forEach(derived => {
        if (!isUndefinedOrNull(derived.formulaIdentifier)) {
          formulaIdentifiers.add(derived.formulaIdentifier);
        }
      });

      hourlyOp?.matsDerivedHourlyValueData?.forEach(matsDerived => {
        if (!isUndefinedOrNull(matsDerived.formulaIdentifier)) {
          formulaIdentifiers.add(matsDerived.formulaIdentifier);
        }
      });

      hourlyOp?.hourlyFuelFlowData?.forEach(fuelFlow => {
        fuelFlow?.hourlyParameterFuelFlowData?.forEach(paramFuelFlow => {
          if (!isUndefinedOrNull(paramFuelFlow.formulaIdentifier)) {
            formulaIdentifiers.add(paramFuelFlow.formulaIdentifier);
          }
        });
      });
    });

    if (formulaIdentifiers.size === 0) {
      return;
    }

    for (const formulaIdentifier of formulaIdentifiers) {
      const monitorFormula = await this.monitorFormulaRepository.getOneFormulaIdsMonLocId(
        {
          formulaIdentifier,
          monitoringLocationId,
        },
      );

      const errorList: string[] = [];
      if (isUndefinedOrNull(monitorFormula)) {
        const errorMessage = CheckCatalogService.formatResultMessage(
          'IMPORT-28-A',
          {
            formulaID: formulaIdentifier,
          },
        );
        errorList.push(errorMessage);
        this.throwIfErrors(errorList);
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
