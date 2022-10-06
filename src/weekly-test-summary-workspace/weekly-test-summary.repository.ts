import { Repository, EntityRepository } from 'typeorm';
import { WeeklyTestSummary } from '../entities/workspace/weekly-test-summary.entity';

@EntityRepository(WeeklyTestSummary)
export class WeeklyTestSummaryWorkspaceRepository extends Repository<
  WeeklyTestSummary
> {
  async export(monitoringLocationIds: string[], year: number, quarter: number) {
    const query = this.createQueryBuilder('wts')
      .innerJoinAndSelect('wts.monitorLocation', 'l')
      .innerJoinAndSelect('wts.reportingPeriod', 'r')
      .leftJoinAndSelect('l.unit', 'u')
      .leftJoinAndSelect('l.stackPipe', 'sp')
      .where(`wts.monitoringLocationId IN (:...monitoringLocationIds)`, {
        monitoringLocationIds: monitoringLocationIds,
      })
      .andWhere('r.year = :year ', { year })
      .andWhere('r.quarter = :quarter ', { quarter });

    return query.getMany();
  }
}
