import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { Nsps4tSummary } from '../entities/workspace/nsps4t-summary.entity';

@Injectable()
export class Nsps4tSummaryWorkspaceRepository extends Repository<
  Nsps4tSummary
> {
  constructor(entityManager: EntityManager) {
    super(Nsps4tSummary, entityManager);
  }
}
