import { DailyTestSummary } from '../entities/workspace/daily-test-summary.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(DailyTestSummary)
export class DailyTestSummaryWorkspaceRepository extends Repository<
  DailyTestSummary
> {
  async export(monitoringLocationIds: string[]) {
    const query = this.createQueryBuilder('dts')
      .leftJoinAndSelect('dts.monitorLocation', 'l')
      .leftJoinAndSelect('l.unit', 'u')
      .leftJoinAndSelect('l.stackPipe', 'sp')
      .leftJoinAndSelect('dts.monitorSystem', 'ms')
      .leftJoinAndSelect('dts.component', 'c')
      .where(`dts.monitoringLocationId IN (:...monitoringLocationIds)`, {
        monitoringLocationIds: monitoringLocationIds,
      });

    return query.getMany();
  }
}
