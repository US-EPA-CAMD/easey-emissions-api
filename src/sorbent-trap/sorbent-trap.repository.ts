import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { SorbentTrap } from '../entities/sorbent-trap.entity';

@Injectable()
export class SorbentTrapRepository extends Repository<SorbentTrap> {
  constructor(entityManager: EntityManager) {
    super(SorbentTrap, entityManager);
  }
}
