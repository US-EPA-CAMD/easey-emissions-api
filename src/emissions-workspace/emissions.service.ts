import { Injectable } from '@nestjs/common';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';

import { EmissionsDTO, EmissionsImportDTO } from '../dto/emissions.dto';
import { EmissionsMap } from '../maps/emissions.map';
import { EmissionsWorkspaceRepository } from './emissions.repository';
import { DailyTestSummaryWorkspaceService } from '../daily-test-summary-workspace/daily-test-summary.service';
import { PlantRepository } from '../plant/plant.repository';
import { DeleteResult, FindConditions } from 'typeorm';
import { Plant } from '../entities/plant.entity';
import { EmissionEvaluation } from '../entities/emission-evaluation.entity';
import { DailyTestSummaryDTO } from '../dto/daily-test-summary.dto';

@Injectable()
export class EmissionsWorkspaceService {
  constructor(
    private readonly map: EmissionsMap,
    private readonly repository: EmissionsWorkspaceRepository,
    private readonly dailyTestSummaryService: DailyTestSummaryWorkspaceService,
    private readonly plantRepository: PlantRepository,
  ) {}

  async delete(
    criteria: FindConditions<EmissionEvaluation>,
  ): Promise<DeleteResult> {
    return this.repository.delete(criteria);
  }

  async export(params: EmissionsParamsDTO): Promise<EmissionsDTO> {
    const promises = [];
    const DAILY_TEST_SUMMARIES = 0;

    const emissions = await this.repository.export(
      params.monitorPlanId,
      params.year,
      params.quarter,
    );

    if (emissions) {
      promises.push(
        this.dailyTestSummaryService.export(
          emissions.monitorPlan?.locations?.map(s => s.id),
        ),
      );

      const promiseResult = await Promise.all(promises);
      const results = await this.map.one(emissions);
      results.dailyTestSummaryData = promiseResult[DAILY_TEST_SUMMARIES];
      return results;
    }
    return new EmissionsDTO();
  }

  async findOne() {
    return this.repository.findOne();
  }

  async import(params: EmissionsImportDTO): Promise<Plant> {
    const plantLocation = await this.plantRepository.getImportLocation({
      orisCode: params.orisCode,
      stackIds: params.dailyTestSummaryData.map(data => data.stackPipeId),
      unitIds: params.dailyTestSummaryData.map(data => data.unitId),
    });

    let monitorPlanId;
    let reportingPeriodId;

    if (typeof plantLocation !== 'undefined' || plantLocation !== null) {
      monitorPlanId = plantLocation.monitorPlans[0].id;
      reportingPeriodId = plantLocation.monitorPlans[0].beginRptPeriod.id;

      const toDelete = plantLocation.monitorPlans.filter(plan => {
        return (
          plan.beginRptPeriod.year === params.year &&
          plan.beginRptPeriod.quarter === params.quarter
        );
      });

      const deletePlans: Array<Promise<DeleteResult>> = [];
      for (const monitorPlan of toDelete) {
        deletePlans.push(
          this.delete({
            monitorPlanId: monitorPlan.id,
            reportingPeriodId: monitorPlan.beginRptPeriod.id,
          }),
        );
      }
      await Promise.all(deletePlans);
    }

    const dailyTestSummaryImports: Array<Promise<DailyTestSummaryDTO>> = [];
    for (const dailyTestSummaryDatum of params.dailyTestSummaryData) {
      dailyTestSummaryImports.push(
        this.dailyTestSummaryService.import({
          ...dailyTestSummaryDatum,
        }),
      );
    }
    await Promise.all(dailyTestSummaryImports);

    this.repository.create({
      monitorPlanId,
      reportingPeriodId,
    });

    return plantLocation;
  }
}
