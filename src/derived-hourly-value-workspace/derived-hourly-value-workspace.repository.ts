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

  async export(hourIds: string[]): Promise<DerivedHrlyValue[]> {
    return this.createQueryBuilder('DerivedHrlyValue')
      .where('DerivedHrlyValue.hour_id IN(:...hourIds)', {
        hourIds,
      })
      .leftJoinAndSelect('DerivedHrlyValue.monitorSystem', 'monitorSystem')
      .leftJoinAndSelect('DerivedHrlyValue.monitorFormula', 'monitorFormula')
      .getMany();
  }
}
