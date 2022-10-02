import { EntityRepository, Repository } from 'typeorm';
import { DailyEmission } from '../entities/workspace/daily-emission.entity';

@EntityRepository(DailyEmission)
export class DailyEmissionWorkspaceRepository extends Repository<
  DailyEmission
> {}
