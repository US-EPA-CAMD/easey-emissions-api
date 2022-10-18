import { Repository, EntityRepository } from 'typeorm';
import { MatsDerivedHrlyValue } from '../entities/mats-derived-hrly-value.entity';

@EntityRepository(MatsDerivedHrlyValue)
export class MatsDerivedHourlyValueRepository extends Repository<
  MatsDerivedHrlyValue
> {
  async export(hourIds: string[]): Promise<MatsDerivedHrlyValue[]> {
    return this.createQueryBuilder('MatsDerivedHrlyValue')
      .leftJoinAndSelect(
        'MatsDerivedHrlyValue.monitorFormula',
        'monitorFormula',
      )
      .where('MatsDerivedHrlyValue.hour_id IN(:...hourIds)', {
        hourIds,
      })
      .getMany();
  }
}
