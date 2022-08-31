import { Repository, EntityRepository } from 'typeorm';
import { MatsDerivedHrlyValue } from '../entities/mats-derived-hrly-value.entity';

@EntityRepository(MatsDerivedHrlyValue)
export class MatsDerivedHourlyValueRepository extends Repository<
  MatsDerivedHrlyValue
> {}