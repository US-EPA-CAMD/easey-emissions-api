import { Repository, EntityRepository } from 'typeorm';

import { StateCode } from '../entities/state-code.entity';

@EntityRepository(StateCode)
export class StateCodeRepository extends Repository<StateCode> {}
