import { EntityRepository, Repository } from 'typeorm';
import { DailyFuel } from '../entities/daily-fuel.entity';

@EntityRepository(DailyFuel)
export class DailyFuelRepository extends Repository<DailyFuel> {}
