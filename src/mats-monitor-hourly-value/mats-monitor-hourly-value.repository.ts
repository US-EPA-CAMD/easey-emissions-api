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

  async export(hourIds: string[]) {
    const query = this.createQueryBuilder('mmhv')
      .leftJoinAndSelect('mmhv.monitorSystem', 'ms')
      .leftJoinAndSelect('mmhv.component', 'c')
      .where(`mmhv.hourId IN (:...hourIds)`, {
        hourIds: hourIds,
      });
    return query.getMany();
  }
}
