import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { EmissionEvaluation } from '../entities/emission-evaluation.entity';

@Injectable()
export class EmissionsRepository extends Repository<EmissionEvaluation> {
  constructor(entityManager: EntityManager) {
    super(EmissionEvaluation, entityManager);
  }

  async export(
    monitorPlanId: string,
    year: number,
    quarter: number,
  ): Promise<EmissionEvaluation> {
    const query = this.createQueryBuilder('e')
      .innerJoinAndSelect('e.reportingPeriod', 'rp')
      .innerJoinAndSelect('e.monitorPlan', 'mp')
      .innerJoinAndSelect('mp.plant', 'p')
      .innerJoinAndSelect('mp.locations', 'ml')
      .where('mp.id = :monitorPlanId', { monitorPlanId })
      .andWhere('rp.year = :year', { year })
      .andWhere('rp.quarter = :quarter', { quarter });
    return query.getOne();
  }
}
