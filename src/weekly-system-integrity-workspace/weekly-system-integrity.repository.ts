import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { WeeklySystemIntegrity } from '../entities/workspace/weekly-system-integrity.entity';

@Injectable()
export class WeeklySystemIntegrityWorkspaceRepository extends Repository<
  WeeklySystemIntegrity
> {
  constructor(entityManager: EntityManager) {
    super(WeeklySystemIntegrity, entityManager);
  }
}
