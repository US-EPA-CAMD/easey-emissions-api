import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { DailyFuel } from '../entities/daily-fuel.entity';

@Injectable()
export class DailyFuelRepository extends Repository<DailyFuel> {
  constructor(entityManager: EntityManager) {
    super(DailyFuel, entityManager);
  }
}
