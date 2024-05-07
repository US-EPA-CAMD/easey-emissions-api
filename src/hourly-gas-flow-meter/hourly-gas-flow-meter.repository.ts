import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { HrlyGasFlowMeter } from '../entities/hrly-gas-flow-meter.entity';

@Injectable()
export class HourlyGasFlowMeterRepository extends Repository<HrlyGasFlowMeter> {
  constructor(entityManager: EntityManager) {
    super(HrlyGasFlowMeter, entityManager);
  }

  async export(hourIds: string[]) {
    const query = this.createQueryBuilder('hgfm')
      .leftJoinAndSelect('hgfm.component', 'c')
      .where(`hgfm.hourId IN (:...hourIds)`, {
        hourIds: hourIds,
      });
    return query.getMany();
  }
}
