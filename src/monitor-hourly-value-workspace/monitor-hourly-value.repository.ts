import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MonitorHrlyValue } from '../entities/workspace/monitor-hrly-value.entity';

@Injectable()
export class MonitorHourlyValueWorkspaceRepository extends Repository<
  MonitorHrlyValue
> {
  constructor(entityManager: EntityManager) {
    super(MonitorHrlyValue, entityManager);
  }

  async export(rptPeriodId: number, monLocIds: string[]) {
    const query = this.createQueryBuilder('mhv')
      .leftJoinAndSelect('mhv.monitorSystem', 'ms')
      .leftJoinAndSelect('mhv.component', 'c')
      .where('mhv.reportingPeriodId = :rptPeriodId', { rptPeriodId })
      .andWhere('mhv.monitoringLocationId IN (:...monLocIds)', { monLocIds })
    return query.getMany();
  }
}
