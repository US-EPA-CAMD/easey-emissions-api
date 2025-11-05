import { Injectable } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { withSlaveConnection } from '@us-epa-camd/easey-common';

import { WeeklySystemIntegrityRepository } from './weekly-system-integrity.repository';
import { WeeklySystemIntegrityDTO } from '../dto/weekly-system-integrity.dto';
import { WeeklySystemIntegrityMap } from '../maps/weekly-system-integrity.map';

@Injectable()
export class WeeklySystemIntegrityService {

  constructor(
    private readonly dataSource: DataSource,
    private readonly map: WeeklySystemIntegrityMap,
    private readonly repository: WeeklySystemIntegrityRepository,
  ) {}

  async export(
    weeklyTestSumIds: string[],
  ): Promise<WeeklySystemIntegrityDTO[]> {
    return withSlaveConnection(this.dataSource, async () => {
      const results = await this.repository.find({
        where: { weeklyTestSumId: In(weeklyTestSumIds) },
      });

      if (!results) {
        return null;
      }
      return this.map.many(results);
    });
  }
}
