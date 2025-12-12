import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, In } from 'typeorm';
import { withSlaveConnection } from '@us-epa-camd/easey-common';

import { DailyCalibrationMap } from '../maps/daily-calibration.map';
import { DailyCalibrationRepository } from './daily-calibration.repository';
import { DailyCalibrationDTO } from '../dto/daily-calibration.dto';

@Injectable()
export class DailyCalibrationService {

  constructor(
    private readonly dataSource: DataSource,
    private readonly map: DailyCalibrationMap,
  ) { }

  async dailyCalibrationByTestSumId(
    dailyTestSummaryIds: string[],
  ): Promise<DailyCalibrationDTO[]> {
    return withSlaveConnection(this.dataSource, async (replicaManager: EntityManager) => {
      const dailyCalibrationRepository = new DailyCalibrationRepository(replicaManager);
      const results = await dailyCalibrationRepository.find({
        where: { dailyTestSummaryId: In(dailyTestSummaryIds) },
      });

      if (!results) {
        return null;
      }

      return this.map.many(results);
    });
  }

  async export(dailyTestSummaryIds: string[]): Promise<DailyCalibrationDTO[]> {
    return this.dailyCalibrationByTestSumId(dailyTestSummaryIds);
  }
}
