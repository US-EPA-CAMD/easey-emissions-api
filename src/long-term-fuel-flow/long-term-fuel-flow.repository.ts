import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { LongTermFuelFlow } from '../entities/long-term-fuel-flow.entity';

@Injectable()
export class LongTermFuelFlowRepository extends Repository<LongTermFuelFlow> {
  constructor(entityManager: EntityManager) {
    super(LongTermFuelFlow, entityManager);
  }

  async export(monitoringLocationIds: string[], year: number, quarter: number) {
    const query = this.createQueryBuilder('ltff')
      .innerJoinAndSelect('ltff.monitorLocation', 'ml')
      .innerJoinAndSelect('ltff.reportingPeriod', 'rp')
      .leftJoinAndSelect('ml.unit', 'u')
      .leftJoinAndSelect('ml.stackPipe', 'sp')
      .leftJoinAndSelect('ltff.monitorSystem', 'ms')
      .where('ltff.monitoringLocationId IN (:...monitoringLocationIds)', {
        monitoringLocationIds: monitoringLocationIds,
      })
      .andWhere('rp.year = :year', { year })
      .andWhere('rp.quarter = :quarter', { quarter });

    return query.getMany();
  }
}
