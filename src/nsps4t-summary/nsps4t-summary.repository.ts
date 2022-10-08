import { EntityRepository, Repository } from 'typeorm';
import { Nsps4tSummary } from '../entities/nsps4t-summary.entity';

@EntityRepository(Nsps4tSummary)
export class Nsps4tSummaryRepository extends Repository<Nsps4tSummary> {}
