import { Injectable } from '@nestjs/common';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';

import { EmissionsDTO } from '../dto/emissions.dto';
import { EmissionsMap } from '../maps/emissions.map';
import { EmissionsWorkspaceRepository } from './emissions.repository';
import { DailyTestSummaryWorkspaceService } from '../daily-test-summary-workspace/daily-test-summary.service';
import { MatsDerivedHrlyValueService } from '../mats-derived-hrly-value-workspace/mats-derived-hrly-value.service';

@Injectable()
export class EmissionsWorkspaceService {
  constructor(
    private readonly map: EmissionsMap,
    private readonly repository: EmissionsWorkspaceRepository,
    private readonly dailyTestSummaryService: DailyTestSummaryWorkspaceService,
    private readonly matsDerivedHrlyValueService: MatsDerivedHrlyValueService,
  ) {}

  async export(params: EmissionsParamsDTO): Promise<EmissionsDTO> {
    const promises = [];
    const DAILY_TEST_SUMMARIES = 0;
    const MATS_DERIVED_HOURLY_VALUES = 1;

    const emissions = await this.repository.export(
      params.monitorPlanId,
      params.year,
      params.quarter,
    );

    const monitorLocationIds = emissions.monitorPlan?.locations?.map(
      location => {
        return location.id;
      },
    );

    if (emissions) {
      promises.push(
        this.dailyTestSummaryService.export(monitorLocationIds),
        this.matsDerivedHrlyValueService.export(monitorLocationIds),
      );

      const promiseResult = await Promise.all(promises);
      const results = await this.map.one(emissions);
      results.dailyTestSummaryData = promiseResult[DAILY_TEST_SUMMARIES];
      results.matsDerivedHrlyValue = promiseResult[MATS_DERIVED_HOURLY_VALUES];
      return results;
    }

    return new EmissionsDTO();
  }
}
