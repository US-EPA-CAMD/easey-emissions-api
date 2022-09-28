import { EntityRepository, Repository } from 'typeorm';
import { DailyFuel } from '../entities/workspace/daily-fuel.entity';

@EntityRepository(DailyFuel)
export class DailyFuelWorkspaceRepository extends Repository<DailyFuel> {}
