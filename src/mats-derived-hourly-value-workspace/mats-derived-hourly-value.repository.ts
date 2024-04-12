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

  async export(hourIds: string[]): Promise<MatsDerivedHrlyValue[]> {
    return this.createQueryBuilder('MatsDerivedHrlyValue')
      .leftJoinAndSelect(
        'MatsDerivedHrlyValue.monitorFormula',
        'monitorFormula',
      )
      .where('MatsDerivedHrlyValue.hour_id IN(:...hourIds)', {
        hourIds,
      })
      .getMany();
  }
}
