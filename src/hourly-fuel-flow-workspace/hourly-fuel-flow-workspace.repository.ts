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

  async export(rptPeriodId: number, monLocIds: string[]) {
    return this.createQueryBuilder('hourlyFuelFlow')
      .leftJoinAndSelect('hourlyFuelFlow.monitorSystem', 'ms')
      .where('hourlyFuelFlow.reportingPeriodId = :rptPeriodId', { rptPeriodId })
      .andWhere('hourlyFuelFlow.monitoringLocationId IN (:...monLocIds)', {
        monLocIds,
      })
      .getMany();
  }
}
