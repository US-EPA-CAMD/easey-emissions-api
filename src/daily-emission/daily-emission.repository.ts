import { EntityRepository, Repository } from 'typeorm';
import { DailyEmission } from '../entities/daily-emission.entity';

@EntityRepository(DailyEmission)
export class DailyEmissionRepository extends Repository<DailyEmission> {}
