import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MonitorSystem } from '../entities/monitor-system.entity';

@Injectable()
export class MonitorSystemRepository extends Repository<MonitorSystem> {
  constructor(entityManager: EntityManager) {
    super(MonitorSystem, entityManager);
  }

  async findOneByIdentifierAndLocation(
    systemIdentifier: string,
    monitoringLocationId: string,
  ) {
    return this.createQueryBuilder('monitorSystem')
      .where('monitorSystem.mon_loc_id = :monitoringLocationId', {
        monitoringLocationId,
      })
      .andWhere('monitorSystem.system_identifier = :systemIdentifier', {
        systemIdentifier,
      })
      .getOne();
  }
}
