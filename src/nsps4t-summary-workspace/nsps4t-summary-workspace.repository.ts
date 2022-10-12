import { EntityRepository, Repository } from 'typeorm';
import { Nsps4tSummary } from '../entities/workspace/nsps4t-summary.entity';

@EntityRepository(Nsps4tSummary)
export class Nsps4tSummaryWorkspaceRepository extends Repository<
  Nsps4tSummary
> {}
