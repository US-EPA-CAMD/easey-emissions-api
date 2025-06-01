import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MatsDerivedHrlyValue } from '../entities/workspace/mats-derived-hrly-value.entity';

@Injectable()
export class MatsDerivedHourlyValueWorkspaceRepository extends Repository<
  MatsDerivedHrlyValue
> {
  constructor(entityManager: EntityManager) {
    super(MatsDerivedHrlyValue, entityManager);
  }

  async export(rptPeriodId: number, monLocIds: string[]): Promise<MatsDerivedHrlyValue[]> {
    return this.createQueryBuilder('MatsDerivedHrlyValue')
      .leftJoinAndSelect(
        'MatsDerivedHrlyValue.monitorFormula',
        'monitorFormula',
      )
      .where('MatsDerivedHrlyValue.reportingPeriodId = :rptPeriodId', { rptPeriodId })
      .andWhere('MatsDerivedHrlyValue.monitoringLocationId IN(:...monLocIds)', { monLocIds })
      .getMany();
  }
}
