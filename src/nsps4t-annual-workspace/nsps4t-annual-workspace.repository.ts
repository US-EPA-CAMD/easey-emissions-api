import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { Nsps4tAnnual } from '../entities/workspace/nsps4t-annual.entity';

@Injectable()
export class Nsps4tAnnualWorkspaceRepository extends Repository<Nsps4tAnnual> {
  constructor(entityManager: EntityManager) {
    super(Nsps4tAnnual, entityManager);
  }
}
