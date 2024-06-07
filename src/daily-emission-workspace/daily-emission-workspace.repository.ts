import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { DailyEmission } from '../entities/workspace/daily-emission.entity';

@Injectable()
export class DailyEmissionWorkspaceRepository extends Repository<
  DailyEmission
> {
  constructor(entityManager: EntityManager) {
    super(DailyEmission, entityManager);
  }
}
