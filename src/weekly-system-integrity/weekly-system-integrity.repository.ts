import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { WeeklySystemIntegrity } from '../entities/weekly-system-integrity.entity';

@Injectable()
export class WeeklySystemIntegrityRepository extends Repository<
  WeeklySystemIntegrity
> {
  constructor(entityManager: EntityManager) {
    super(WeeklySystemIntegrity, entityManager);
  }
}
