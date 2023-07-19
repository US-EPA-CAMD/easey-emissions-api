import { DailyBackstop } from '../entities/daily-backstop.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(DailyBackstop)
export class DailyBackstopRepository extends Repository<DailyBackstop> {}
