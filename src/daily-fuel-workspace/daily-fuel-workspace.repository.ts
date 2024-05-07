import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { DailyFuel } from '../entities/workspace/daily-fuel.entity';

@Injectable()
export class DailyFuelWorkspaceRepository extends Repository<DailyFuel> {
  constructor(entityManager: EntityManager) {
    super(DailyFuel, entityManager);
  }
}
