import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { DailyBackstop } from '../entities/daily-backstop.entity';

@Injectable()
export class DailyBackstopRepository extends Repository<DailyBackstop> {
  constructor(entityManager: EntityManager) {
    super(DailyBackstop, entityManager);
  }
}
