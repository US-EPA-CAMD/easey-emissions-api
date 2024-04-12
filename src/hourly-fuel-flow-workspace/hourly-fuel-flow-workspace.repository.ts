import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { HrlyFuelFlow } from '../entities/workspace/hrly-fuel-flow.entity';

@Injectable()
export class HourlyFuelFlowWorkspaceRepository extends Repository<
  HrlyFuelFlow
> {
  constructor(entityManager: EntityManager) {
    super(HrlyFuelFlow, entityManager);
  }

  async export(hourlyOperatingIds: string[]) {
    return this.createQueryBuilder('hourlyFuelFlow')
      .where('hourlyFuelFlow.hour_id IN (:...hourlyOperatingIds)', {
        hourlyOperatingIds,
      })
      .leftJoinAndSelect('hourlyFuelFlow.monitorSystem', 'ms')
      .getMany();
  }
}
