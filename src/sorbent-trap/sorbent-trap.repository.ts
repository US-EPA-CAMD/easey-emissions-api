import { EntityRepository, Repository } from 'typeorm';
import { SorbentTrap } from '../entities/sorbent-trap.entity';

@EntityRepository(SorbentTrap)
export class SorbentTrapRepository extends Repository<SorbentTrap> {}
