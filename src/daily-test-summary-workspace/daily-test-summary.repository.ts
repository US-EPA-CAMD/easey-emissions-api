import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { DailyTestSummary } from '../entities/workspace/daily-test-summary.entity';

@Injectable()
export class DailyTestSummaryWorkspaceRepository extends Repository<
  DailyTestSummary
> {
  constructor(entityManager: EntityManager) {
    super(DailyTestSummary, entityManager);
  }

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

  async findByTestTypeCode(testTypeCode: string, monitoringLocationId: string): Promise<DailyTestSummary> {
    return this.createQueryBuilder('dts')
      .where('dts.testTypeCode = :testTypeCode', { testTypeCode })
      .andWhere('dts.monitoringLocationId = :monitoringLocationId', { monitoringLocationId })
      .getOne();
  }
}
