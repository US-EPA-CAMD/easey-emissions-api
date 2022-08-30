import { EmissionEvaluation } from '../entities/workspace/emission-evaluation.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(EmissionEvaluation)
export class EmissionsWorkspaceRepository extends Repository<
  EmissionEvaluation
> {
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
