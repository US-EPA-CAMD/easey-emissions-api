import { Repository, EntityRepository } from 'typeorm';
import { WeeklySystemIntegrity } from '../entities/workspace/weekly-system-integrity.entity';

@EntityRepository(WeeklySystemIntegrity)
export class WeeklySystemIntegrityWorkspaceRepository extends Repository<
  WeeklySystemIntegrity
> {}
