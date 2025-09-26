import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions/easey.exception';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { DeleteResult, EntityManager } from 'typeorm';

import { ComponentRepository } from '../component/component.repository';
import { DailyBackstopWorkspaceService } from '../daily-backstop-workspace/daily-backstop.service';
import { DailyEmissionWorkspaceService } from '../daily-emission-workspace/daily-emission-workspace.service';
import { DailyTestSummaryWorkspaceService } from '../daily-test-summary-workspace/daily-test-summary.service';
import { EmissionsDTO, EmissionsImportDTO } from '../dto/emissions.dto';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { MonitorLocation } from '../entities/monitor-location.entity';
import { ReportingPeriod } from '../entities/workspace/reporting-period.entity';
import { HourlyOperatingWorkspaceService } from '../hourly-operating-workspace/hourly-operating.service';
import { LongTermFuelFlowWorkspaceService } from '../long-term-fuel-flow-workspace/long-term-fuel-flow.service';
import { EmissionsMap } from '../maps/emissions.map';
import { MonitorFormulaRepository } from '../monitor-formula/monitor-formula.repository';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { Nsps4tSummaryWorkspaceService } from '../nsps4t-summary-workspace/nsps4t-summary-workspace.service';
import { PlantRepository } from '../plant/plant.repository';
import { SorbentTrapWorkspaceService } from '../sorbent-trap-workspace/sorbent-trap-workspace.service';
import { SummaryValueWorkspaceService } from '../summary-value-workspace/summary-value.service';
import { DeleteCriteria } from '../types';
import { removeNonReportedValues } from '../utils/remove-non-reported-values';
import {
  arrayFilterUndefinedNull,
  hasArrayValues,
  isUndefinedOrNull,
  objectValuesByKey,
  withTransaction,
} from '../utils/utils';
import { WeeklyTestSummaryWorkspaceService } from '../weekly-test-summary-workspace/weekly-test-summary.service';
import { EmissionsChecksService } from './emissions-checks.service';
import { EmissionsWorkspaceRepository } from './emissions.repository';
import { EaseyContentService} from '../emissions-easey-content/easey-content.service';
import { EmissionsService } from '../emissions/emissions.service';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

type Dictionary = { [index: string]: string }

type IdentifierDictionaries = {
  components: Dictionary,
  monitorFormulas: Dictionary,
  monitoringSystems: Dictionary,
}

export type ImportIdentifiers = {
  locations: { [key: string]: IdentifierDictionaries },
  userId: string,
}

@Injectable()
export class EmissionsWorkspaceService {
  constructor(
    private readonly emissionsService: EmissionsService,
    private readonly entityManager: EntityManager,
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
    private readonly dailyBackstopWorkspaceService: DailyBackstopWorkspaceService,
    private readonly easeyContentService: EaseyContentService,
  ) { }

  async delete(criteria: DeleteCriteria): Promise<DeleteResult> {
    return this.repository.delete(criteria);
  }

  async importFromHistoricalData(
    params: EmissionsParamsDTO,
    user: CurrentUser,
  ) {
    const historicalData = await this.emissionsService.export(params, params.reportedValuesOnly);
    if (!historicalData || Object.keys(historicalData).length === 0) {
      throw new NotFoundException(
        'Import unsuccessful: no historical data found for this reporting period.',
      );
    }
    const emissionsImportDTOData = historicalData as EmissionsImportDTO;
    await this.checksService.runChecks(emissionsImportDTOData);
    return await this.import(emissionsImportDTOData, user.userId);
  }

  async export(
    params: EmissionsParamsDTO,
    rptValuesOnly: boolean = false,
  ): Promise<EmissionsDTO | EmissionsImportDTO> {
    const promises = [];
    const DAILY_TEST_SUMMARIES = 0;
    const HOURLY_OPERATING = 1;
    const DAILY_EMISSION = 2;
    const SORBENT_TRAP = 3;
    const WEEKLY_TEST_SUMMARIES = 4;
    const SUMMARY_VALUES = 5;
    const NSPS4T_SUMMARY = 6;
    const LONG_TERM_FUEL_FLOW = 7;
    const DAILY_BACKSTOP = 8;

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
      promises.push(
        this.dailyBackstopWorkspaceService.export(locationIds, params),
      );

      const promiseResult = await Promise.all(promises);
      const mappedResults = await this.map.one(emissions);
      // instantiating EmissionsDTO class is necessary for @Transform to work properly
      const version = this.easeyContentService.emissionsSchema?.version;
      const results = {version, ...new EmissionsDTO(mappedResults)};
      results.dailyTestSummaryData = promiseResult[DAILY_TEST_SUMMARIES] ?? [];
      results.hourlyOperatingData = promiseResult[HOURLY_OPERATING] ?? [];
      results.dailyEmissionData = promiseResult[DAILY_EMISSION] ?? [];
      results.sorbentTrapData = promiseResult[SORBENT_TRAP] ?? [];
      results.weeklyTestSummaryData =
        promiseResult[WEEKLY_TEST_SUMMARIES] ?? [];
      results.summaryValueData = promiseResult[SUMMARY_VALUES] ?? [];
      results.nsps4tSummaryData = promiseResult[NSPS4T_SUMMARY] ?? [];
      results.longTermFuelFlowData = promiseResult[LONG_TERM_FUEL_FLOW] ?? [];
      results.dailyBackstopData = promiseResult[DAILY_BACKSTOP] ?? [];

      if (rptValuesOnly) {
        await removeNonReportedValues(results);
      }

      return results;
    }

    return new EmissionsDTO();
  }

  async import(
    params: EmissionsImportDTO,
    userId?: string,
  ): Promise<{ message: string }> {
    // Pre-transaction validation phase - which is only read operations
      const stackPipeIds = objectValuesByKey<string>('stackPipeId', params, true);
      const unitIds = objectValuesByKey<string>('unitId', params, true);

      const plant = await this.plantRepository.getImportPlant({
        orisCode: params.orisCode,
        stackIds: stackPipeIds,
        unitIds: unitIds,
      });

      if (isUndefinedOrNull(plant)) {
        throw new NotFoundException('Plant not found.');
      }

      const monitorPlans = plant.monitorPlans;

      if (monitorPlans.length === 0) {
        throw new NotFoundException('Monitor plan not found.');
      }

      if (monitorPlans.length > 1) {
        throw new NotFoundException('Multiple active monitor plans found.');
      }

      const reportingPeriod = await this.entityManager.findOne(ReportingPeriod, {
        where: {
          year: params.year,
          quarter: params.quarter,
        },
      });

      if (!reportingPeriod) {
        throw new NotFoundException('Reporting period not found.');
      }

      const monitorPlanId = monitorPlans[0].id;
      const monitoringLocations = monitorPlans[0].locations;

      const reportingPeriodId = reportingPeriod.id;

      const identifiers = await this.getUnifiedIdentifiers(
        params,
        monitoringLocations,
        userId,
      );

      // Import-28 Valid formulaIdentifiers for location
      await this.checksService.invalidFormulasCheck(params, monitoringLocations);

      // Transaction phase - only data modification operations
      // Since all previous queries target unmodified data, it makes sense to start the transaction here
      const queryRunner = this.entityManager.connection.createQueryRunner();
      await queryRunner.startTransaction();

      try {
        const trx = queryRunner.manager;

        for (const monitorPlan of monitorPlans) {
          await trx.query(
            'CALL camdecmpswks.delete_monitor_plan_emissions_data_from_workspace($1, $2)',
            [monitorPlan.id, reportingPeriodId],
          );
        }

        const currentTime = currentDateTime().toISOString();

        // Execute imports sequentially to maintain transaction integrity
        await this.importDailyEmissions(
          params,
          monitoringLocations,
          reportingPeriodId,
          identifiers,
          currentTime,
          trx,
        );

        await this.importDailyTestSummaries(
          params,
          monitoringLocations,
          reportingPeriodId,
          identifiers,
          currentTime,
          trx,
        );

        await this.importHourlyOperating(
          params,
          monitoringLocations,
          reportingPeriodId,
          identifiers,
          currentTime,
          trx,
        );

        await this.importSummaryValue(
          params,
          monitoringLocations,
          reportingPeriodId,
          identifiers,
          currentTime,
          trx,
        );
        await this.importSorbentTrap(
          params,
          reportingPeriodId,
          monitoringLocations,
          identifiers,
          currentTime,
          trx,
        );
        await this.importNsps4tSummaries(
          params,
          monitoringLocations,
          reportingPeriodId,
          identifiers,
          currentTime,
          trx,
        );
        await this.importWeeklyTestSummary(
          params,
          monitoringLocations,
          reportingPeriodId,
          identifiers,
          currentTime,
          trx,
        );
        await this.importLongTermFuelFlow(
          params,
          monitoringLocations,
          reportingPeriodId,
          identifiers,
          currentTime,
          trx,
        );
        await this.importDailyBackstop(
          params,
          monitoringLocations,
          reportingPeriodId,
          identifiers,
          currentTime,
          trx,
        );

        const repository = withTransaction(this.repository, trx);
        await repository.save(
          repository.create({
            monitorPlanId,
            reportingPeriodId,
            evalStatusCd: 'EVAL',
            needsEvalFlag: 'Y',
            submissionAvailabilityCd: 'GRANTED',
            lastUpdated: new Date(),
          }),
        );

        await repository.updateAllViews(
          monitorPlanId,
          params.quarter,
          params.year,
        );

        //Finally, perform the updates (reset needs eval flag, etc) for those records
        this.updateCollaterallyAffectedRecords(monitorPlanId, reportingPeriodId);

        await queryRunner.commitTransaction();

        return {
          message: `Successfully Imported Emissions Data for Facility Id/Oris Code [${params.orisCode}]`,
        };
      } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
      } finally {
        await queryRunner.release();
      }
    }

  async updateCollaterallyAffectedRecords(monitorPlanId: string, reportingPeriodId: number): Promise<void> {
    //1. Update affected EM Records
    const emResult = await this.repository.query(
      'SELECT * FROM camdecmpswks.update_collateral_em_data_for_em_changes($1, $2)',
      [monitorPlanId, reportingPeriodId],
    );

    if (emResult[0].result === 'F') {
      throw new Error(`EM Deletion Failed: ${emResult[0].error_msg}`);
    }
  }

  async importDailyEmissions(
    emissionsImport: EmissionsImportDTO,
    monitoringLocations: MonitorLocation[],
    reportingPeriodId: number,
    identifiers: ImportIdentifiers,
    currentTime: string,
    trx?: EntityManager,
  ) {
    await this.dailyEmissionService.import(
      emissionsImport,
      monitoringLocations,
      reportingPeriodId,
      identifiers,
      currentTime,
      trx,
    );
  }

  async importDailyTestSummaries(
    emissionsImport: EmissionsImportDTO,
    monitoringLocations: MonitorLocation[],
    reportingPeriodId: number,
    identifiers: ImportIdentifiers,
    currentTime: string,
    trx?: EntityManager,
  ): Promise<void> {
    await this.dailyTestSummaryService.import(
      emissionsImport,
      monitoringLocations,
      reportingPeriodId,
      identifiers,
      currentTime,
      trx,
    );
  }

  async importHourlyOperating(
    emissionsImport: EmissionsImportDTO,
    monitoringLocations: MonitorLocation[],
    reportingPeriodId: number,
    identifiers: ImportIdentifiers,
    currentTime: string,
    trx?: EntityManager,
  ): Promise<void> {
    await this.hourlyOperatingService.import(
      emissionsImport,
      monitoringLocations,
      reportingPeriodId,
      identifiers,
      currentTime,
      trx,
    );
  }

  async importSummaryValue(
    emissionsImport: EmissionsImportDTO,
    monitoringLocations: MonitorLocation[],
    reportingPeriodId,
    identifiers: ImportIdentifiers,
    currentTime: string,
    trx?: EntityManager,
  ): Promise<void> {
    await this.summaryValueService.import(
      emissionsImport,
      monitoringLocations,
      reportingPeriodId,
      identifiers,
      currentTime,
      trx,
    );
  }

  async importSorbentTrap(
    emissionsImport: EmissionsImportDTO,
    reportingPeriodId: number,
    monitoringLocations: MonitorLocation[],
    identifiers: ImportIdentifiers,
    currentTime: string,
    trx?: EntityManager,
  ): Promise<void> {
    await this.sorbentTrapService.import(
      emissionsImport,
      monitoringLocations,
      reportingPeriodId,
      identifiers,
      currentTime,
      trx,
    );
  }

  async importNsps4tSummaries(
    emissionsImport: EmissionsImportDTO,
    monitoringLocations: MonitorLocation[],
    reportingPeriodId: number,
    identifiers: ImportIdentifiers,
    currentTime: string,
    trx?: EntityManager,
  ): Promise<void> {
    await this.nsps4tSummaryWorkspaceService.import(
      emissionsImport,
      monitoringLocations,
      reportingPeriodId,
      identifiers,
      currentTime,
      trx,
    );
  }

  async importWeeklyTestSummary(
    emissionsImport: EmissionsImportDTO,
    monitoringLocations: MonitorLocation[],
    reportingPeriodId: number,
    identifiers: ImportIdentifiers,
    currentTime: string,
    trx?: EntityManager,
  ) {
    await this.weeklyTestSummaryService.import(
      emissionsImport,
      monitoringLocations,
      reportingPeriodId,
      identifiers,
      currentTime,
      trx,
    );
  }

  async importLongTermFuelFlow(
    emissionsImport: EmissionsImportDTO,
    monitoringLocations: MonitorLocation[],
    reportingPeriodId: number,
    identifiers: ImportIdentifiers,
    currentTime: string,
    trx?: EntityManager,
  ): Promise<void> {
    await this.longTermFuelFlowWorkspaceService.import(
      emissionsImport,
      monitoringLocations,
      reportingPeriodId,
      identifiers,
      currentTime,
      trx,
    );
  }

  async importDailyBackstop(
    emissionsImport: EmissionsImportDTO,
    monitoringLocations: MonitorLocation[],
    reportingPeriodId: number,
    identifiers: ImportIdentifiers,
    currentTime: string,
    trx?: EntityManager,
  ): Promise<void> {
    await this.dailyBackstopWorkspaceService.import(
      emissionsImport,
      monitoringLocations,
      reportingPeriodId,
      identifiers,
      currentTime,
      trx,
    );
  }

  async getIdentifiers(
    emissionsImport: EmissionsImportDTO,
    monitoringLocationId: string,
    userId: string,
  ) {
    const identifiers = {
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
      'formulaId',
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

  async getUnifiedIdentifiers(
    params: EmissionsImportDTO,
    locations: MonitorLocation[],
    userId: string,
  ) {
    let identifiers = {
      locations: {},
      userId,
    };

    for (const location of locations) {
      const partialIdentifiers = await this.getIdentifiers(
        params,
        location.id,
        userId,
      );
      Object.keys(partialIdentifiers.components).forEach(
        key =>
          partialIdentifiers.components[key] === undefined &&
          delete partialIdentifiers.components[key],
      );
      Object.keys(partialIdentifiers.monitorFormulas).forEach(
        key =>
          partialIdentifiers.monitorFormulas[key] === undefined &&
          delete partialIdentifiers.monitorFormulas[key],
      );
      Object.keys(partialIdentifiers.monitoringSystems).forEach(
        key =>
          partialIdentifiers.monitoringSystems[key] === undefined &&
          delete partialIdentifiers.monitoringSystems[key],
      );

      identifiers.locations[location.id] = { components: partialIdentifiers.components, monitorFormulas: partialIdentifiers.monitorFormulas, monitoringSystems: partialIdentifiers.monitoringSystems };
    }

    return identifiers;
  }

  async getMonitoringLocationId(
    monitoringLocations: MonitorLocation[], dataType,
  ) {
    const filteredLocations = monitoringLocations.filter(location => {
      return (
        location.unit?.name === dataType.unitId ||
        location.stackPipe?.name === dataType.stackPipeId
      );
    });
    return filteredLocations[0].id;
  }
}
