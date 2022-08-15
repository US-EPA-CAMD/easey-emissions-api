import { Injectable } from '@nestjs/common';
import { DailyTestSummaryDTO } from '../dto/daily-test-summary.dto';

import { DailyCalibrationWorkspaceService } from '../daily-calibration-workspace/daily-calibration.service';
import { DailyTestSummaryMap } from '../maps/daily-test-summary.map';
import { DailyTestSummaryWorkspaceRepository } from './daily-test-summary.repository';

@Injectable()
export class DailyTestSummaryWorkspaceService {
  constructor(
    private readonly map: DailyTestSummaryMap,
    private readonly repository: DailyTestSummaryWorkspaceRepository,
    private readonly dailyCalibrationService: DailyCalibrationWorkspaceService,
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
