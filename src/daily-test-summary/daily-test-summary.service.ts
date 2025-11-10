import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { withSlaveConnection } from '@us-epa-camd/easey-common';

import { DailyTestSummaryMap } from '../maps/daily-test-summary.map';
import { DailyTestSummaryRepository } from './daily-test-summary.repository';
import { DailyTestSummaryDTO } from '../dto/daily-test-summary.dto';
import { DailyCalibrationService } from '../daily-calibration/daily-calibration.service';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';

@Injectable()
export class DailyTestSummaryService {

  constructor(
    private readonly dataSource: DataSource,
    private readonly map: DailyTestSummaryMap,
    private readonly dailyCalibrationService: DailyCalibrationService,
  ) {}

  async getDailyTestSummariesByLocationIds(
    monitoringLocationIds: string[],
    params: EmissionsParamsDTO,
  ): Promise<DailyTestSummaryDTO[]> {
    return withSlaveConnection(this.dataSource, async (replicaManager: EntityManager) => {
      const dailyTestSummaryRepository = new DailyTestSummaryRepository(replicaManager);
      const results = await dailyTestSummaryRepository.export(
        monitoringLocationIds,
        params.year,
        params.quarter,
      );

      return this.map.many(results);
    });
  }

  async export(
    monitoringLocationIds: string[],
    params: EmissionsParamsDTO,
  ): Promise<DailyTestSummaryDTO[]> {
    return withSlaveConnection(this.dataSource, async () => {
      const summaries = await this.getDailyTestSummariesByLocationIds(
        monitoringLocationIds,
        params,
      );

      if (summaries) {
        const dailyCalibrations = await this.dailyCalibrationService.export(
          summaries?.map(i => i.id),
        );

        summaries.forEach(s => {
          s.dailyCalibrationData =
            dailyCalibrations?.filter(i => i.dailyTestSumId === s.id) ?? [];
        });
      }

      return summaries;
    });
  }
}
