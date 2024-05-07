import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { HrlyFuelFlow } from '../entities/hrly-fuel-flow.entity';

@Injectable()
export class HourlyFuelFlowRepository extends Repository<HrlyFuelFlow> {
  constructor(entityManager: EntityManager) {
    super(HrlyFuelFlow, entityManager);
  }

  async export(hourlyOperatingIds: string[]) {
    return this.createQueryBuilder('hourlyFuelFlow')
      .leftJoinAndSelect('hourlyFuelFlow.monitorSystem', 'ms')
      .where('hourlyFuelFlow.hour_id IN (:...hourlyOperatingIds)', {
        hourlyOperatingIds,
      })
      .getMany();
  }
}
