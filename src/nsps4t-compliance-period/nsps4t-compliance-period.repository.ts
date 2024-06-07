import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { Nsps4tCompliancePeriod } from '../entities/nsps4t-compliance-period.entity';

@Injectable()
export class Nsps4tCompliancePeriodRepository extends Repository<
  Nsps4tCompliancePeriod
> {
  constructor(entityManager: EntityManager) {
    super(Nsps4tCompliancePeriod, entityManager);
  }
}
