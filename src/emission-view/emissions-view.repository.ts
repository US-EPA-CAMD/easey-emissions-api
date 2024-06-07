import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { DataSet } from '../entities/dataset.entity';

@Injectable()
export class EmissionsViewRepository extends Repository<DataSet> {
  constructor(entityManager: EntityManager) {
    super(DataSet, entityManager);
  }
}
