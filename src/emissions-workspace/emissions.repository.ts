import { Repository, EntityRepository } from 'typeorm';
import { EmissionEvaluation } from '../entities/emission-evaluation.entity';

@EntityRepository(EmissionEvaluation)
export class EmissionsWorkspaceRepository extends Repository<EmissionEvaluation> {
  async export(monPlanId: string, year: number, quarter: number) {
    const query = this.createQueryBuilder('e')
      .innerJoinAndSelect('e.reportingPeriod', 'rp')
      .innerJoinAndSelect('e.plan', 'mp')
      .innerJoinAndSelect('mp.plant', 'p')
      .innerJoinAndSelect('mp.locations', 'ml')
      .innerJoinAndSelect('ml.dailyTestSummaries', 'dts')
      .innerJoinAndSelect('dts.dailyCalibrations', 'd')
      .where('mp.id = :monPlanId', { monPlanId })
      .andWhere('rp.year = :year', { year })
      .andWhere('rp.quarter = :quarter', { quarter });

    //console.log(query.getQueryAndParameters());
    return query.getOne();
  }
}
