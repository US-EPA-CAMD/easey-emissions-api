import { EntityRepository, Repository } from 'typeorm';
import { Nsps4tCompliancePeriod } from '../entities/nsps4t-compliance-period.entity';

@EntityRepository(Nsps4tCompliancePeriod)
export class Nsps4tCompliancePeriodRepository extends Repository<
  Nsps4tCompliancePeriod
> {}
