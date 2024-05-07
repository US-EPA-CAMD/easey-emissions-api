import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { Nsps4tAnnual } from '../entities/nsps4t-annual.entity';

@Injectable()
export class Nsps4tAnnualRepository extends Repository<Nsps4tAnnual> {
  constructor(entityManager: EntityManager) {
    super(Nsps4tAnnual, entityManager);
  }
}
