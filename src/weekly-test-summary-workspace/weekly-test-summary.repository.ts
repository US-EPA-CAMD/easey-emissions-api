import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { WeeklyTestSummary } from '../entities/workspace/weekly-test-summary.entity';

@Injectable()
export class WeeklyTestSummaryWorkspaceRepository extends Repository<
  WeeklyTestSummary
> {
  constructor(entityManager: EntityManager) {
    super(WeeklyTestSummary, entityManager);
  }

  async export(monitoringLocationIds: string[], year: number, quarter: number) {
    const query = this.createQueryBuilder('wts')
      .innerJoinAndSelect('wts.monitorLocation', 'l')
      .innerJoinAndSelect('wts.reportingPeriod', 'r')
      .leftJoinAndSelect('l.unit', 'u')
      .leftJoinAndSelect('l.stackPipe', 'sp')
      .leftJoinAndSelect('wts.component', 'c')
      .where(`wts.monitoringLocationId IN (:...monitoringLocationIds)`, {
        monitoringLocationIds: monitoringLocationIds,
      })
      .andWhere('r.year = :year ', { year })
      .andWhere('r.quarter = :quarter ', { quarter });

    return query.getMany();
  }

  async findByTestTypeCode(testTypeCode: string, monitoringLocationId: string): Promise<WeeklyTestSummary> {
    return this.createQueryBuilder('wts')
      .where('wts.testTypeCode = :testTypeCode', { testTypeCode })
      .andWhere('wts.monitoringLocationId = :monitoringLocationId', { monitoringLocationId })
      .getOne();
  }
}
