import { Injectable } from '@nestjs/common';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';

import { EmissionsDTO } from '../dto/emissions.dto';
import { EmissionsMap } from '../maps/emissions.map';
import { EmissionsWorkspaceRepository } from './emissions.repository';
import { DailyTestSummaryWorkspaceService } from '../daily-test-summary-workspace/daily-test-summary.service';

@Injectable()
export class EmissionsWorkspaceService {
  constructor(
    private readonly map: EmissionsMap,
    private readonly repository: EmissionsWorkspaceRepository,
    private readonly dailyTestSummaryService: DailyTestSummaryWorkspaceService,
  ) {}

  async export(params: EmissionsParamsDTO): Promise<EmissionsDTO> {
    const promises = [];
    const DAILY_TEST_SUMMARIES = 0;

    let emissions = await this.repository.export(
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
}
