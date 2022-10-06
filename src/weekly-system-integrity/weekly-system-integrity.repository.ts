import { Repository, EntityRepository } from 'typeorm';

import { WeeklySystemIntegrity } from '../entities/weekly-system-integrity.entity';

@EntityRepository(WeeklySystemIntegrity)
export class WeeklySystemIntegrityRepository extends Repository<
  WeeklySystemIntegrity
> {}
