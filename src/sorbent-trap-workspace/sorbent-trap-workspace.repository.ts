import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { SorbentTrap } from '../entities/workspace/sorbent-trap.entity';

@Injectable()
export class SorbentTrapWorkspaceRepository extends Repository<SorbentTrap> {
  constructor(entityManager: EntityManager) {
    super(SorbentTrap, entityManager);
  }
}
