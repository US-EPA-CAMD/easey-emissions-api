import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { DeleteResult, FindConditions, getManager } from 'typeorm';

import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { EmissionsDTO, EmissionsImportDTO } from '../dto/emissions.dto';
import { EmissionsMap } from '../maps/emissions.map';
import { EmissionsWorkspaceRepository } from './emissions.repository';
import { DailyTestSummaryWorkspaceService } from '../daily-test-summary-workspace/daily-test-summary.service';
import { PlantRepository } from '../plant/plant.repository';
import { HourlyOperatingWorkspaceService } from '../hourly-operating-workspace/hourly-operating.service';
import {
  arrayFilterUndefinedNull,
  hasArrayValues,
  isUndefinedOrNull,
  objectValuesByKey,
} from '../utils/utils';
import { EmissionsChecksService } from './emissions-checks.service';
import { ComponentRepository } from '../component/component.repository';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { MonitorFormulaRepository } from '../monitor-formula/monitor-formula.repository';
import { DailyEmissionWorkspaceService } from '../daily-emission-workspace/daily-emission-workspace.service';
import { SummaryValueDTO } from '../dto/summary-value.dto';
import { SummaryValueWorkspaceService } from '../summary-value-workspace/summary-value.service';
import { SorbentTrapWorkspaceService } from '../sorbent-trap-workspace/sorbent-trap-workspace.service';
import { WeeklyTestSummaryWorkspaceService } from '../weekly-test-summary-workspace/weekly-test-summary.service';
import { Nsps4tSummaryWorkspaceService } from '../nsps4t-summary-workspace/nsps4t-summary-workspace.service';
import { WeeklyTestSummaryDTO } from '../dto/weekly-test-summary.dto';
import { EmissionEvaluation } from '../entities/workspace/emission-evaluation.entity';
import { LongTermFuelFlowWorkspaceService } from '../long-term-fuel-flow-workspace/long-term-fuel-flow.service';
import { LongTermFuelFlowDTO } from '../dto/long-term-fuel-flow.dto';
import { ReportingPeriod } from '../entities/workspace/reporting-period.entity';

// Import Identifier: Table Id
export type ImportIdentifiers = {
  components: {
    [key: string]: string;
  };
  monitorFormulas: {
    [key: string]: string;
  };
  monitoringSystems: {
    [key: string]: string;
  };
  userId?: string;
};

@Injectable()
export class EmissionsWorkspaceService {
  constructor(
    private readonly map: EmissionsMap,
    private readonly checksService: EmissionsChecksService,
    private readonly repository: EmissionsWorkspaceRepository,
    private readonly dailyTestSummaryService: DailyTestSummaryWorkspaceService,
    private readonly plantRepository: PlantRepository,
    private readonly dailyEmissionService: DailyEmissionWorkspaceService,
    private readonly hourlyOperatingService: HourlyOperatingWorkspaceService,
    private readonly componentRepository: ComponentRepository,
    private readonly monitorSystemRepository: MonitorSystemRepository,
    private readonly monitorFormulaRepository: MonitorFormulaRepository,
    private readonly summaryValueService: SummaryValueWorkspaceService,
    private readonly sorbentTrapService: SorbentTrapWorkspaceService,
    private readonly weeklyTestSummaryService: WeeklyTestSummaryWorkspaceService,
    private readonly nsps4tSummaryWorkspaceService: Nsps4tSummaryWorkspaceService,
    private readonly summaryValueWorkspaceService: SummaryValueWorkspaceService,
    private readonly longTermFuelFlowWorkspaceService: LongTermFuelFlowWorkspaceService,
  ) {}

  async delete(
    criteria: FindConditions<EmissionEvaluation>,
  ): Promise<DeleteResult> {
    return this.repository.delete(criteria);
  }

  async export(params: EmissionsParamsDTO): Promise<EmissionsDTO> {
    const promises = [];
    const DAILY_TEST_SUMMARIES = 0;
    const HOURLY_OPERATING = 1;
    const DAILY_EMISSION = 2;
    const SORBENT_TRAP = 3;
    const WEEKLY_TEST_SUMMARIES = 4;
    const SUMMARY_VALUES = 5;
    const NSPS4T_SUMMARY = 6;
    const LONG_TERM_FUEL_FLOW = 7;

    const emissions = await this.repository.export(
      params.monitorPlanId,
      params.year,
      params.quarter,
    );

    if (emissions && Array.isArray(emissions.monitorPlan?.locations)) {
      const locationIds = emissions.monitorPlan?.locations?.map(s => s.id);

      promises.push(this.dailyTestSummaryService.export(locationIds, params));
      promises.push(this.hourlyOperatingService.export(locationIds, params));
      promises.push(this.dailyEmissionService.export(locationIds, params));
      promises.push(this.sorbentTrapService.export(locationIds, params));
      promises.push(this.weeklyTestSummaryService.export(locationIds, params));
      promises.push(
        this.summaryValueWorkspaceService.export(locationIds, params),
      );
      promises.push(
        this.nsps4tSummaryWorkspaceService.export(locationIds, params),
      );
      promises.push(
        this.longTermFuelFlowWorkspaceService.export(locationIds, params),
      );

      const promiseResult = await Promise.all(promises);
      const mappedResults = await this.map.one(emissions);
      // instantiating EmissionsDTO class is necessary for @Transform to work properly
      const results = new EmissionsDTO(mappedResults);
      results.dailyTestSummaryData = promiseResult[DAILY_TEST_SUMMARIES] ?? [];
      results.hourlyOperatingData = promiseResult[HOURLY_OPERATING] ?? [];
      results.dailyEmissionData = promiseResult[DAILY_EMISSION] ?? [];
      results.sorbentTrapData = promiseResult[SORBENT_TRAP] ?? [];
      results.weeklyTestSummaryData =
        promiseResult[WEEKLY_TEST_SUMMARIES] ?? [];
      results.summaryValueData = promiseResult[SUMMARY_VALUES] ?? [];
      results.nsps4tSummaryData = promiseResult[NSPS4T_SUMMARY] ?? [];
      results.longTermFuelFlowData = promiseResult[LONG_TERM_FUEL_FLOW] ?? [];

      return results;
    }
    return new EmissionsDTO();
  }

  async import(
    params: EmissionsImportDTO,
    userId?: string,
  ): Promise<{ message: string }> {
    const stackPipeIds = objectValuesByKey<string>('stackPipeId', params, true);
    const unitIds = objectValuesByKey<string>('unitId', params, true);

    const plantLocation = await this.plantRepository.getImportLocations({
      orisCode: params.orisCode,
      stackIds: stackPipeIds,
      unitIds: unitIds,
    });

    if (isUndefinedOrNull(plantLocation)) {
      throw new NotFoundException('Plant not found.');
    }

    const filteredMonitorPlans = plantLocation.monitorPlans?.filter(plan => {
      return isUndefinedOrNull(plan.endRptPeriod)
    });

    if (filteredMonitorPlans.length === 0) {
      throw new NotFoundException('Monitor plan not found.');
    }

    if (filteredMonitorPlans.length > 1) {
      throw new NotFoundException('Multiple active monitor plans found.');
    }


    const manager = getManager();
    const reportingPeriod = await manager.findOne(ReportingPeriod, {
      where:{
        year: params.year,
        quarter: params.quarter,
      }
    })

    if( !reportingPeriod ){
      throw new NotFoundException('Reporting period not found.');
    }

    const monitorPlanId = filteredMonitorPlans[0].id;
    const monitoringLocationId = filteredMonitorPlans[0].locations?.[0].id;

    const reportingPeriodId = reportingPeriod.id;
    const identifiers = await this.getIdentifiers(
      params,
      monitoringLocationId,
      userId,
    );

    // Import-28 Valid formulaIdentifiers for location
    await this.checksService.invalidFormulasCheck(params, monitoringLocationId);

    for (const monitorPlan of filteredMonitorPlans) {
      await manager.query(
        'CALL camdecmpswks.delete_monitor_plan_emissions_data_from_workspace($1, $2)',
        [monitorPlan.id, reportingPeriodId],
      );
    }

    const importPromises = [
      this.importDailyEmissions(
        params,
        reportingPeriodId,
        monitoringLocationId,
        identifiers,
      ),

      this.importDailyTestSummaries(
        params,
        reportingPeriodId,
        monitoringLocationId,
        identifiers,
      ),

      this.importHourlyOperating(
        params,
        monitoringLocationId,
        reportingPeriodId,
        identifiers,
      ),

      this.importSummaryValue(
        params,
        monitoringLocationId,
        reportingPeriodId,
        identifiers,
      ),
      this.importSorbentTrap(
        params,
        reportingPeriodId,
        monitoringLocationId,
        identifiers,
      ),
      this.importNsps4tSummaries(
        params,
        monitoringLocationId,
        reportingPeriodId,
        identifiers,
      ),
      this.importWeeklyTestSummary(
        params,
        monitoringLocationId,
        reportingPeriodId,
        identifiers,
      ),
      this.importLongTermFuelFlow(
        params,
        monitoringLocationId,
        reportingPeriodId,
        identifiers,
      ),
    ];

    const importResults = await Promise.allSettled(importPromises);

    for (const importResult of importResults) {
      if (importResult.status === 'rejected') {
        throw new LoggingException(
          importResult.reason.detail,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    try {
      await this.repository.save(
        this.repository.create({
          monitorPlanId,
          reportingPeriodId,
          evalStatusCd: 'EVAL',
          lastUpdated: new Date(),
        }),
      );

      await this.repository.updateAllViews(
        monitorPlanId,
        params.quarter,
        params.year,
      );
    } catch (e) {
      throw new LoggingException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    console.log(
      `Successfully Imported Emissions Data for Facility Id/Oris Code [${params.orisCode}]`,
    );

    return {
      message: `Successfully Imported Emissions Data for Facility Id/Oris Code [${params.orisCode}]`,
    };
  }

  async importDailyEmissions(
    emissionsImport: EmissionsImportDTO,
    reportingPeriodId: number,
    monitoringLocationId: string,
    identifiers: ImportIdentifiers,
  ) {
    if (hasArrayValues(emissionsImport.dailyEmissionData)) {
      const promises = [];
      for (const dailyEmission of emissionsImport.dailyEmissionData) {
        promises.push(
          this.dailyEmissionService.import({
            ...dailyEmission,
            identifiers,
            monitoringLocationId,
            reportingPeriodId,
          }),
        );
      }
      return Promise.all(promises);
    }
  }

  async importDailyTestSummaries(
    emissionsImport: EmissionsImportDTO,
    reportingPeriodId: number,
    monitoringLocationId: string,
    identifiers: ImportIdentifiers,
  ) {
    const dailyTestSummaryImports: Array<Promise<void>> = [];

    if (Array.isArray(emissionsImport.dailyTestSummaryData)) {
      for (const dailyTestSummaryDatum of emissionsImport.dailyTestSummaryData) {
        dailyTestSummaryImports.push(
          this.dailyTestSummaryService.import({
            ...dailyTestSummaryDatum,
            reportingPeriodId,
            monitoringLocationId,
            identifiers,
          }),
        );
      }
      return Promise.all(dailyTestSummaryImports);
    }
  }

  async importHourlyOperating(
    emissionsImport: EmissionsImportDTO,
    monitoringLocationId: string,
    reportingPeriodId: number,
    identifiers: ImportIdentifiers,
  ): Promise<void> {
    await this.hourlyOperatingService.import(
      emissionsImport,
      monitoringLocationId,
      reportingPeriodId,
      identifiers,
    );
  }

  async importSummaryValue(
    emissionsImport: EmissionsImportDTO,
    monitoringLocationId: string,
    reportingPeriodId,
    identifiers: ImportIdentifiers,
  ) {
    const summaryValueImports: Array<Promise<SummaryValueDTO>> = [];

    if (Array.isArray(emissionsImport.summaryValueData)) {
      for (const summaryValueDatum of emissionsImport.summaryValueData) {
        summaryValueImports.push(
          this.summaryValueService.import({
            ...summaryValueDatum,
            monitoringLocationId,
            reportingPeriodId,
            identifiers,
          }),
        );
      }
    }

    return Promise.all(summaryValueImports);
  }

  async importSorbentTrap(
    emissionsImport: EmissionsImportDTO,
    reportingPeriodId: number,
    monitoringLocationId: string,
    identifiers: ImportIdentifiers,
  ) {
    if (hasArrayValues(emissionsImport.sorbentTrapData)) {
      const promises = [];
      for (const sorbentTrap of emissionsImport.sorbentTrapData) {
        promises.push(
          this.sorbentTrapService.import({
            ...sorbentTrap,
            monitoringLocationId,
            reportingPeriodId,
            identifiers,
          }),
        );
      }
      return Promise.all(promises);
    }
  }

  async importNsps4tSummaries(
    emissionsImport: EmissionsImportDTO,
    monitoringLocationId: string,
    reportingPeriodId: number,
    identifiers: ImportIdentifiers,
  ) {
    const nsps4tSummaryImports = [];

    if (Array.isArray(emissionsImport.nsps4tSummaryData)) {
      for (const nsps4tSummary of emissionsImport.nsps4tSummaryData) {
        nsps4tSummaryImports.push(
          this.nsps4tSummaryWorkspaceService.import({
            ...nsps4tSummary,
            monitoringLocationId,
            reportingPeriodId,
            identifiers,
          }),
        );
      }
    }

    return Promise.all(nsps4tSummaryImports);
  }

  async importWeeklyTestSummary(
    emissionsImport: EmissionsImportDTO,
    monitoringLocationId: string,
    reportingPeriodId: number,
    identifiers: ImportIdentifiers,
  ) {
    const weeklyTestSummaryImports: Array<Promise<WeeklyTestSummaryDTO>> = [];

    if (Array.isArray(emissionsImport.weeklyTestSummaryData)) {
      for (const weeklyTestSummary of emissionsImport.weeklyTestSummaryData) {
        weeklyTestSummaryImports.push(
          this.weeklyTestSummaryService.import({
            ...weeklyTestSummary,
            reportingPeriodId,
            monitoringLocationId,
            identifiers,
          }),
        );
      }
    }
    return Promise.all(weeklyTestSummaryImports);
  }

  async importLongTermFuelFlow(
    emissionsImport: EmissionsImportDTO,
    monitoringLocationId: string,
    reportingPeriodId: number,
    identifiers: ImportIdentifiers,
  ) {
    const longTermFuelFlowImports: Array<Promise<LongTermFuelFlowDTO>> = [];

    if (Array.isArray(emissionsImport.longTermFuelFlowData)) {
      for (const longTermFuelFlow of emissionsImport.longTermFuelFlowData) {
        longTermFuelFlowImports.push(
          this.longTermFuelFlowWorkspaceService.import({
            ...longTermFuelFlow,
            reportingPeriodId,
            monitoringLocationId,
            identifiers,
          }),
        );
      }
    }
    return Promise.all(longTermFuelFlowImports);
  }

  async getIdentifiers(
    emissionsImport: EmissionsImportDTO,
    monitoringLocationId: string,
    userId: string,
  ) {
    const identifiers: ImportIdentifiers = {
      components: {},
      monitorFormulas: {},
      monitoringSystems: {},
      userId,
    };

    const componentIdentifiers = objectValuesByKey<string>(
      'componentId',
      emissionsImport,
      true,
    );
    const formulaIdentifiers = objectValuesByKey<string>(
      'formulaIdentifier',
      emissionsImport,
      true,
    );
    const monitoringSystemIdentifiers = objectValuesByKey<string>(
      'monitoringSystemId',
      emissionsImport,
      true,
    );

    const promises = [];

    if (hasArrayValues(componentIdentifiers)) {
      for (const componentId of arrayFilterUndefinedNull(
        componentIdentifiers,
      )) {
        promises.push(
          this.componentRepository
            .findOneByIdentifierAndLocation(componentId, monitoringLocationId)
            .then(data => (identifiers.components[componentId] = data?.id)),
        );
      }
    }

    if (hasArrayValues(formulaIdentifiers)) {
      for (const formulaId of arrayFilterUndefinedNull(formulaIdentifiers)) {
        promises.push(
          this.monitorFormulaRepository
            .getOneFormulaIdsMonLocId({
              formulaIdentifier: formulaId,
              monitoringLocationId,
            })
            .then(data => (identifiers.monitorFormulas[formulaId] = data?.id)),
        );
      }
    }

    if (hasArrayValues(monitoringSystemIdentifiers)) {
      for (const monSysIdentifier of arrayFilterUndefinedNull(
        monitoringSystemIdentifiers,
      )) {
        promises.push(
          this.monitorSystemRepository
            .findOneByIdentifierAndLocation(
              monSysIdentifier,
              monitoringLocationId,
            )
            .then(
              data =>
                (identifiers.monitoringSystems[monSysIdentifier] = data?.id),
            ),
        );
      }
    }

    await Promise.all(promises);

    return identifiers;
  }
}
