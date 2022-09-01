import { DailyTestSummary } from '../entities/workspace/daily-test-summary.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(DailyTestSummary)
export class DailyTestSummaryWorkspaceRepository extends Repository<
  DailyTestSummary
> {
  async export(monitoringLocationIds: string[], year: number, quarter: number) {
    const query = this.createQueryBuilder('dts')
      .innerJoinAndSelect('dts.monitorLocation', 'l')
      .innerJoinAndSelect('dts.reportingPeriod', 'r')
      .leftJoinAndSelect('l.unit', 'u')
      .leftJoinAndSelect('l.stackPipe', 'sp')
      .leftJoinAndSelect('dts.monitorSystem', 'ms')
      .leftJoinAndSelect('dts.component', 'c')
      .where(`dts.monitoringLocationId IN (:...monitoringLocationIds)`, {
        monitoringLocationIds: monitoringLocationIds,
      })
      .andWhere('r.year = :year ', { year })
      .andWhere('r.quarter = :quarter ', { quarter });

    return query.getMany();
  }
}
