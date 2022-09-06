import { Injectable, NotFoundException } from '@nestjs/common';
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
import { isUndefinedOrNull } from '../utils/utils';

@Injectable()
export class EmissionsWorkspaceService {
  constructor(
    private readonly map: EmissionsMap,
    private readonly repository: EmissionsWorkspaceRepository,
    private readonly dailyTestSummaryService: DailyTestSummaryWorkspaceService,
    private readonly plantRepository: PlantRepository,
    private readonly hourlyOperatingService: HourlyOperatingWorkspaceService,
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

    const emissions = await this.repository.export(
      params.monitorPlanId,
      params.year,
      params.quarter,
    );

    if (emissions) {
      const locationIds = emissions.monitorPlan?.locations?.map(s => s.id);

      promises.push(this.dailyTestSummaryService.export(locationIds, params));
      promises.push(this.hourlyOperatingService.export(locationIds, params));

      const promiseResult = await Promise.all(promises);
      const results = await this.map.one(emissions);
      results.dailyTestSummaryData = promiseResult[DAILY_TEST_SUMMARIES];
      results.hourlyOperatingData = promiseResult[HOURLY_OPERATING];

      return results;
    }
    return new EmissionsDTO();
  }

  async findOne() {
    return this.repository.findOne();
  }

  async import(params: EmissionsImportDTO): Promise<{ message: string }> {
    const plantLocation = await this.plantRepository.getImportLocations({
      orisCode: params.orisCode,
      stackIds: params.dailyTestSummaryData?.map(data => data.stackPipeId),
      unitIds: params.dailyTestSummaryData?.map(data => data.unitId),
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

    const monitorPlanId = filteredMonitorPlans[0].id;
    const monitoringLocationId = filteredMonitorPlans[0].locations?.[0].id;
    const reportingPeriodId = filteredMonitorPlans[0].beginRptPeriod.id;

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

    await this.importDailyTestSummaries(
      params,
      reportingPeriodId,
      monitoringLocationId,
    );

    await this.repository.save(
      this.repository.create({
        monitorPlanId,
        reportingPeriodId,
      }),
    );

    return {
      message: `Successfully Imported Emissions Data for Facility Id/Oris Code [${params.orisCode}]`,
    };
  }

  async importDailyTestSummaries(
    emissionsImport: EmissionsImportDTO,
    reportingPeriodId: number,
    monitoringLocationId: string,
  ) {
    const dailyTestSummaryImports: Array<Promise<DailyTestSummaryDTO>> = [];

    if (Array.isArray(emissionsImport.dailyTestSummaryData)) {
      for (const dailyTestSummaryDatum of emissionsImport.dailyTestSummaryData) {
        dailyTestSummaryImports.push(
          this.dailyTestSummaryService.import({
            ...dailyTestSummaryDatum,
            reportingPeriodId,
            monitoringLocationId,
          }),
        );
      }
      await Promise.all(dailyTestSummaryImports);
    }
  }
}
