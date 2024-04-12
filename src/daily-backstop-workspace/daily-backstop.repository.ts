import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { DailyBackstop } from '../entities/workspace/daily-backstop.entity';

@Injectable()
export class DailyBackstopWorkspaceRepository extends Repository<
  DailyBackstop
> {
  constructor(entityManager: EntityManager) {
    super(DailyBackstop, entityManager);
  }
}
