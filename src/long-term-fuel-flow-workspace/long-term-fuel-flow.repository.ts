import { EntityRepository, Repository } from 'typeorm';
import { LongTermFuelFlow } from '../entities/workspace/long-term-fuel-flow.entity';

@EntityRepository(LongTermFuelFlow)
export class LongTermFuelFlowWorkspaceRepository extends Repository<LongTermFuelFlow> {}
