import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EmissionsSubmissionsProgressRepository } from './emissions-submissions-progress.repository';
import { EmissionsSubmissionsProgress } from '../entities/vw-emissions-submissions-progress.entity';
import { EmissionsSubmissionsProgressMap } from '../maps/emissions-submissions-progress.map';
import { EmissionsSubmissionsProgressDTO } from '../dto/emissions-submissions-progress.dto';
import { EmissionsRepository } from './emissions.repository';
import { EmissionsMap } from '../maps/emissions.map';
import { EmissionsDTO } from '../dto/emissions.dto';
import { DailyTestSummaryService } from '../daily-test-summary/daily-test-summary.service';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';

@Injectable()
export class EmissionsService {
  constructor(
    private readonly map: EmissionsMap,
    private readonly repository: EmissionsRepository,
    private readonly submissionProgressMap: EmissionsSubmissionsProgressMap,
    private readonly submissionProgressRepo: EmissionsSubmissionsProgressRepository,
    private readonly configService: ConfigService,
    private readonly dailyTestSummaryService: DailyTestSummaryService,
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

  async getSubmissionProgress(
    periodDate: Date,
  ): Promise<EmissionsSubmissionsProgressDTO> {
    let queryResult = await this.submissionProgressRepo.getSubmissionProgress(
      periodDate,
      this.configService.get<number>('app.submissionDays'),
    );

    const date = new Date(periodDate);
    const month = date.getUTCMonth() + 1;

    if (queryResult === undefined) {
      if (
        ['development', 'test', 'local-dev'].includes(
          this.configService.get<string>('app.env'),
        ) &&
        ([1, 4, 7, 10].includes(month) ||
          ([2, 5, 8, 11].includes(month) && date.getUTCDate() <= 7))
      ) {
        queryResult = new EmissionsSubmissionsProgress();

        let year = date.getUTCFullYear();
        if (month >= 1 && month <= 3) {
          queryResult.quarter = 4;
          year--;
        } else if (month >= 4 && month <= 6) {
          queryResult.quarter = 1;
        } else if (month >= 7 && month <= 9) {
          queryResult.quarter = 2;
        } else {
          queryResult.quarter = 3;
        }
        queryResult.calendarYear = year;
        queryResult.submittedPercentage = Math.floor(Math.random() * 100);
      } else {
        return undefined;
      }
    }

    return this.submissionProgressMap.one(queryResult);
  }
}
