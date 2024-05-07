import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MonitorPlan } from '../entities/workspace/monitor-plan.entity';

@Injectable()
export class MonitorPlanWorkspaceRepository extends Repository<MonitorPlan> {
  constructor(entityManager: EntityManager) {
    super(MonitorPlan, entityManager);
  }

  async getMonitorPlansByLocationIds(
    monitoringLocationIds: string[],
  ): Promise<MonitorPlan[]> {
    const query = this.createQueryBuilder('mp')
      .innerJoinAndSelect('mp.locations', 'ml')
      .where('ml.id IN (:...monitoringLocationIds)', { monitoringLocationIds });
    return query.getMany();
  }
}
