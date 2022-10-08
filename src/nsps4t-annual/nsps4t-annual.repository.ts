import { EntityRepository, Repository } from 'typeorm';
import { Nsps4tAnnual } from '../entities/nsps4t-annual.entity';

@EntityRepository(Nsps4tAnnual)
export class Nsps4tAnnualRepository extends Repository<Nsps4tAnnual> {}
