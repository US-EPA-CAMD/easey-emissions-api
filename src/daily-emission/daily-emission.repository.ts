import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { DailyEmission } from '../entities/daily-emission.entity';

@Injectable()
export class DailyEmissionRepository extends Repository<DailyEmission> {
  constructor(entityManager: EntityManager) {
    super(DailyEmission, entityManager);
  }
}
