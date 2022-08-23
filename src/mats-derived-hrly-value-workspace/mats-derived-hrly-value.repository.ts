import { EntityRepository, Repository } from 'typeorm';
import { MatsDerivedHrlyValue } from '../entities/mats-derived-hrly-value.entity';

@EntityRepository(MatsDerivedHrlyValue)
export class MatsDerivedHrlyValueRepository extends Repository<
  MatsDerivedHrlyValue
> {
  async export(monitoringLocationIds: string[]) {
    return this.createQueryBuilder('MatsDerivedHrlyValue')
      .where(`MatsDerivedHrlyValue.mon_loc_id IN (...:monitoringLocationIds)`, {
        monitoringLocationIds,
      })
      .getMany();
  }
}
