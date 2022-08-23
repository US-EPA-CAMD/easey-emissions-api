import { Injectable } from '@nestjs/common';

import { DailyTestSummaryMap } from '../maps/daily-test-summary.map';
import { DailyTestSummaryRepository } from './daily-test-summary.repository';
import { DailyTestSummaryDTO } from '../dto/daily-test-summary.dto';
import { DailyCalibrationService } from '../daily-calibration/daily-calibration.service';

@Injectable()
export class DailyTestSummaryService {
  constructor(
    private readonly map: DailyTestSummaryMap,
    private readonly repository: DailyTestSummaryRepository,
    private readonly dailyCalibrationService: DailyCalibrationService,
  ) {}

  async getDailyTestSummariesByLocationIds(
    monitoringLocationIds: string[],
  ): Promise<DailyTestSummaryDTO[]> {
    const results = await this.repository.export(monitoringLocationIds);

    return this.map.many(results);
  }

  async export(
    monitoringLocationIds: string[],
  ): Promise<DailyTestSummaryDTO[]> {
    const summaries = await this.getDailyTestSummariesByLocationIds(
      monitoringLocationIds,
    );

    const dailyCalibrations = await this.dailyCalibrationService.export(
      summaries?.map(i => i.id),
    );

    summaries.forEach(s => {
      s.dailyCalibrationData = dailyCalibrations.filter(
        i => i.dailyTestSumId === s.id,
      );
    });

    return summaries;
  }
}
