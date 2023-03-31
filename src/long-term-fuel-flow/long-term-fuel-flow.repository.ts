import { EntityRepository, Repository } from 'typeorm';
import { LongTermFuelFlow } from '../entities/long-term-fuel-flow.entity';

@EntityRepository(LongTermFuelFlow)
export class LongTermFuelFlowRepository extends Repository<LongTermFuelFlow> {}
