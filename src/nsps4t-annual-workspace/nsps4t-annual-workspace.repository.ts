import { EntityRepository, Repository } from 'typeorm';
import { Nsps4tAnnual } from '../entities/workspace/nsps4t-annual.entity';

@EntityRepository(Nsps4tAnnual)
export class Nsps4tAnnualWorkspaceRepository extends Repository<Nsps4tAnnual> {}
