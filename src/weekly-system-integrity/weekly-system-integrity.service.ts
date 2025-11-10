import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, In } from 'typeorm';
import { withSlaveConnection } from '@us-epa-camd/easey-common';

import { WeeklySystemIntegrityRepository } from './weekly-system-integrity.repository';
import { WeeklySystemIntegrityDTO } from '../dto/weekly-system-integrity.dto';
import { WeeklySystemIntegrityMap } from '../maps/weekly-system-integrity.map';

@Injectable()
export class WeeklySystemIntegrityService {

  constructor(
    private readonly dataSource: DataSource,
    private readonly map: WeeklySystemIntegrityMap,
  ) {}

  async export(
    weeklyTestSumIds: string[],
  ): Promise<WeeklySystemIntegrityDTO[]> {
    return withSlaveConnection(this.dataSource, async (replicaManager: EntityManager) => {
      const weeklySystemIntegrityRepository = new WeeklySystemIntegrityRepository(replicaManager);
      const results = await weeklySystemIntegrityRepository.find({
        where: { weeklyTestSumId: In(weeklyTestSumIds) },
      });

      if (!results) {
        return null;
      }
      return this.map.many(results);
    });
  }
}
