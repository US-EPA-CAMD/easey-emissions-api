import { Repository, EntityRepository } from 'typeorm';
import { SummaryValue } from '../entities/workspace/summary-value.entity';

@EntityRepository(SummaryValue)
export class SummaryValueWorkspaceRepository extends Repository<SummaryValue> {
  async export(monitoringLocationIds: string[], year: number, quarter: number) {
    const query = this.createQueryBuilder('sv')
      .innerJoinAndSelect('sv.monitorLocation', 'ml')
      .innerJoinAndSelect('sv.reportingPeriod', 'rp')
      .leftJoinAndSelect('ml.unit', 'u')
      .leftJoinAndSelect('ml.stackPipe', 'sp')
      .where(`sv.monitoringLocationId IN (:...monitoringLocationIds)`, {
        monitoringLocationIds: monitoringLocationIds,
      })
      .andWhere('rp.year = :year ', { year })
      .andWhere('rp.quarter = :quarter ', { quarter });

    return query.getMany();
  }
}
