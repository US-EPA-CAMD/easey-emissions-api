import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';

import { EmissionsDTO, EmissionsImportDTO } from '../dto/emissions.dto';
import { EmissionsMap } from '../maps/emissions.map';
import { EmissionsWorkspaceRepository } from './emissions.repository';
import { DailyTestSummaryWorkspaceService } from '../daily-test-summary-workspace/daily-test-summary.service';
import { PlantRepository } from '../plant/plant.repository';
import { DeleteResult, FindConditions } from 'typeorm';
import { EmissionEvaluation } from '../entities/emission-evaluation.entity';
import { DailyTestSummaryDTO } from '../dto/daily-test-summary.dto';
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
import { HourlyOperatingDTO } from '../dto/hourly-operating.dto';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { DailyEmissionWorkspaceService } from '../daily-emission-workspace/daily-emission-workspace.service';
import { SorbentTrapWorkspaceService } from '../sorbent-trap-workspace/sorbent-trap-workspace.service';

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
    private readonly sorbentTrapService: SorbentTrapWorkspaceService,
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

      const promiseResult = await Promise.all(promises);
      const mappedResults = await this.map.one(emissions);
      // instantiating EmissionsDTO class is necessary for @Transform to work properly
      const results = new EmissionsDTO(mappedResults);
      results.dailyTestSummaryData = promiseResult[DAILY_TEST_SUMMARIES];
      results.hourlyOperatingData = promiseResult[HOURLY_OPERATING];
      results.dailyEmissionData = promiseResult[DAILY_EMISSION];
      results.sorbentTrapData = promiseResult[SORBENT_TRAP];

      return results;
    }
    return new EmissionsDTO();
  }

  async findOne() {
    return this.repository.findOne();
  }

  async import(
    params: EmissionsImportDTO,
    userId?: string,
  ): Promise<{ message: string }> {
    const stackPipeIds: string[] = [];
    const unitIds: string[] = [];

    for (const collection of Object.keys(params)) {
      if (Array.isArray(params[collection]) && collection.length > 0) {
        stackPipeIds.push(
          ...params[collection]
            ?.map(data => data.stackPipeId)
            .filter(id => !isUndefinedOrNull(id)),
        );
        unitIds.push(
          ...params[collection]
            ?.map(data => data.unitId)
            .filter(id => !isUndefinedOrNull(id)),
        );
      }
    }

    const plantLocation = await this.plantRepository.getImportLocations({
      orisCode: params.orisCode,
      stackIds: [...new Set(stackPipeIds)],
      unitIds: [...new Set(unitIds)],
    });
    if (isUndefinedOrNull(plantLocation)) {
      throw new NotFoundException('Plant not found.');
    }

    const filteredMonitorPlans = plantLocation.monitorPlans?.filter(plan => {
      return (
        plan.beginRptPeriod.year === params.year &&
        plan.beginRptPeriod.quarter === params.quarter
      );
    });

    if (isUndefinedOrNull(filteredMonitorPlans[0])) {
      throw new NotFoundException('Monitor plan not found.');
    }

    const monitorPlanId = filteredMonitorPlans[0].id;
    const monitoringLocationId = filteredMonitorPlans[0].locations?.[0].id;
    const reportingPeriodId = filteredMonitorPlans[0].beginRptPeriod.id;
    const identifiers = await this.getIdentifiers(
      params,
      monitoringLocationId,
      userId,
    );

    // Import-28 Valid formulaIdentifiers for location
    await this.checksService.invalidFormulasCheck(params, monitoringLocationId);

    const evaluationDeletes: Array<Promise<DeleteResult>> = [];
    for (const monitorPlan of filteredMonitorPlans) {
      evaluationDeletes.push(
        this.delete({
          monitorPlanId: monitorPlan.id,
          reportingPeriodId: monitorPlan.beginRptPeriod.id,
        }),
      );
    }
    await Promise.all(evaluationDeletes);

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
      this.importSorbentTrap(
        params,
        reportingPeriodId,
        monitoringLocationId,
        identifiers,
      ),
    ];

    const importResults = await Promise.allSettled(importPromises);

    for (const importResult of importResults) {
      if (importResult.status === 'rejected') {
        throw new LoggingException(
          importResult.reason.details,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    try {
      await this.repository.save(
        this.repository.create({
          monitorPlanId,
          reportingPeriodId,
        }),
      );
    } catch (e) {
      throw new LoggingException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

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
    const dailyTestSummaryImports: Array<Promise<DailyTestSummaryDTO>> = [];

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
  ) {
    const hourlyOperatingImports: Array<Promise<HourlyOperatingDTO>> = [];

    if (Array.isArray(emissionsImport.hourlyOperatingData)) {
      for (const hourlyOperatingDatum of emissionsImport.hourlyOperatingData) {
        hourlyOperatingImports.push(
          this.hourlyOperatingService.import(emissionsImport, {
            ...hourlyOperatingDatum,
            reportingPeriodId,
            monitoringLocationId,
            identifiers,
          }),
        );
      }
    }

    return Promise.all(hourlyOperatingImports);
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

  async getIdentifiers(
    emissionsImport: EmissionsImportDTO,
    monitoringLocationId: string,
    userId: string,
  ) {
    const untypedParams = (emissionsImport as unknown) as Record<
      string,
      unknown
    >;

    const identifiers: ImportIdentifiers = {
      components: {},
      monitorFormulas: {},
      monitoringSystems: {},
      userId,
    };

    const componentIdentifiers = objectValuesByKey<string>(
      'componentId',
      untypedParams,
      true,
    );
    const formulaIdentifiers = objectValuesByKey<string>(
      'formulaIdentifier',
      untypedParams,
      true,
    );
    const monitoringSystemIdentifiers = objectValuesByKey<string>(
      'monitoringSystemId',
      untypedParams,
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
