import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { DerivedHrlyValue } from '../entities/workspace/derived-hrly-value.entity';

@Injectable()
export class DerivedHourlyValueWorkspaceRepository extends Repository<
  DerivedHrlyValue
> {
  constructor(entityManager: EntityManager) {
    super(DerivedHrlyValue, entityManager);
  }

  async export(rptPeriodId: number, monLocIds: string[]): Promise<DerivedHrlyValue[]> {
    return this.createQueryBuilder('DerivedHrlyValue')
      .leftJoinAndSelect('DerivedHrlyValue.monitorSystem', 'monitorSystem')
      .leftJoinAndSelect('DerivedHrlyValue.monitorFormula', 'monitorFormula')
      .where('DerivedHrlyValue.rptPeriodId = :rptPeriodId', { rptPeriodId })
      .andWhere('DerivedHrlyValue.monitorLocationId IN(:...monLocIds)', { monLocIds })
      .getMany();
  }
}
