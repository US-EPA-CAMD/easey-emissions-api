import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { withSlaveConnection } from '@us-epa-camd/easey-common';

import { DailyFuelDTO } from '../dto/daily-fuel.dto';
import { DailyFuelRepository } from './daily-fuel.repository';
import { exportDailyFuelData } from '../daily-fuel-functions/export-daily-fuel-data';

@Injectable()
export class DailyFuelService {

  constructor(
    private readonly dataSource: DataSource,
  ) {}

  async export(dailyEmissionIds: string[]): Promise<DailyFuelDTO[]> {
    return withSlaveConnection(this.dataSource, async (replicaManager: EntityManager) => {
      const dailyFuelRepository = new DailyFuelRepository(replicaManager);
      return exportDailyFuelData({
        dailyEmissionIds,
        repository: dailyFuelRepository,
      });
    });
  }
}
