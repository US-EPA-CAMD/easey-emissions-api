import { DailyBackstop } from '../entities/workspace/daily-backstop.entity';
import { Repository, EntityRepository } from 'typeorm';
@EntityRepository(DailyBackstop)
export class DailyBackstopWorkspaceRepository extends Repository<DailyBackstop> {}
