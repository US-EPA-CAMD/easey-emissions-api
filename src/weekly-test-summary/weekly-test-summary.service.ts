import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { withSlaveConnection } from '@us-epa-camd/easey-common';

import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { WeeklyTestSummaryMap } from '../maps/weekly-test-summary.map';
import { WeeklyTestSummaryRepository } from './weekly-test-summary.repository';
import { WeeklyTestSummaryDTO } from '../dto/weekly-test-summary.dto';
import { WeeklySystemIntegrityService } from '../weekly-system-integrity/weekly-system-integrity.service';

@Injectable()
export class WeeklyTestSummaryService {

  constructor(
    private readonly dataSource: DataSource,
    private readonly map: WeeklyTestSummaryMap,
    private readonly weeklySystemIntegrityService: WeeklySystemIntegrityService,
  ) {}

  async getWeeklyTestSummariesByLocationIds(
    monitoringLocationIds: string[],
    params: EmissionsParamsDTO,
  ): Promise<WeeklyTestSummaryDTO[]> {
    return withSlaveConnection(this.dataSource, async (replicaManager: EntityManager) => {
      const weeklyTestSummaryRepository = new WeeklyTestSummaryRepository(replicaManager);
      const results = await weeklyTestSummaryRepository.export(
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
  ): Promise<WeeklyTestSummaryDTO[]> {
    return withSlaveConnection(this.dataSource, async () => {
      const weeklyTestSummaries = await this.getWeeklyTestSummariesByLocationIds(
        monitoringLocationIds,
        params,
      );

      if (weeklyTestSummaries) {
        const weeklySystemIntegrityData = await this.weeklySystemIntegrityService.export(
          weeklyTestSummaries?.map(i => i.id),
        );
        weeklyTestSummaries?.forEach(weeklyTestSum => {
          weeklyTestSum.weeklySystemIntegrityData =
            weeklySystemIntegrityData?.filter(
              i => i.weeklyTestSumId === weeklyTestSum.id,
            ) ?? [];
        });
      }
      return weeklyTestSummaries;
    });
  }
}
