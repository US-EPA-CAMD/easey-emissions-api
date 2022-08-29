import { MatsDerivedHrlyValue } from '../entities/workspace/mats-derived-hrly-value.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(MatsDerivedHrlyValue)
export class MatsDerivedHourlyValueWorkspaceRepository extends Repository<
  MatsDerivedHrlyValue
> {}
