import { EntityRepository, Repository } from 'typeorm';
import { Nsps4tCompliancePeriod } from '../entities/workspace/nsps4t-compliance-period.entity';

@EntityRepository(Nsps4tCompliancePeriod)
export class Nsps4tCompliancePeriodWorkspaceRepository extends Repository<
  Nsps4tCompliancePeriod
> {}
