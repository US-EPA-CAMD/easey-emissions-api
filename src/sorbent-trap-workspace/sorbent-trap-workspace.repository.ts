import { EntityRepository, Repository } from 'typeorm';
import { SorbentTrap } from '../entities/workspace/sorbent-trap.entity';

@EntityRepository(SorbentTrap)
export class SorbentTrapWorkspaceRepository extends Repository<SorbentTrap> {}
