import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MatsMonitorHrlyValue } from '../entities/mats-monitor-hrly-value.entity';

@Injectable()
export class MatsMonitorHourlyValueRepository extends Repository<
  MatsMonitorHrlyValue
> {
  constructor(entityManager: EntityManager) {
    super(MatsMonitorHrlyValue, entityManager);
  }

  async export(rptPeriodId: number, monLocIds: string[]) {
    const query = this.createQueryBuilder('mmhv')
      .leftJoinAndSelect('mmhv.monitorSystem', 'ms')
      .leftJoinAndSelect('mmhv.component', 'c')
      .where('mmhv.reportingPeriodId = :rptPeriodId', { rptPeriodId })
      .andWhere('mmhv.monitoringLocationId IN (:...monLocIds)', { monLocIds });
    return query.getMany();
  }
}
