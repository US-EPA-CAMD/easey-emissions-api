import { Repository, EntityRepository } from 'typeorm';
import { SummaryValue } from '../entities/workspace/summary-value.entity';

@EntityRepository(SummaryValue)
export class SummaryValueWorkspaceRepository extends Repository<
SummaryValue
> {}
