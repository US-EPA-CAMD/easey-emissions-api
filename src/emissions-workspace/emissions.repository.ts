import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { EmissionEvaluation } from '../entities/workspace/emission-evaluation.entity';

@Injectable()
export class EmissionsWorkspaceRepository extends Repository<
  EmissionEvaluation
> {
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

  async updateAllViews(monitorPlanId: string, quarter: number, year: number) {
    await this.query('CALL camdecmpswks.refresh_emissions_views($1,$2,$3)', [
      monitorPlanId,
      year,
      quarter,
    ]);
  }
}
