import { EntityRepository, Repository } from 'typeorm';
import { DerivedHrlyValue } from '../entities/derived-hrly-value.entity';

@EntityRepository(DerivedHrlyValue)
export class DerivedHourlyValueRepository extends Repository<DerivedHrlyValue> {
  async export(hourIds: string[]): Promise<DerivedHrlyValue[]> {
    return this.createQueryBuilder('DerivedHrlyValue')
      .where('DerivedHrlyValue.hour_id IN(:...hourIds)', {
        hourIds,
      })
      .innerJoinAndSelect('DerivedHrlyValue.monitorSystem', 'monitorSystem')
      .getMany();
  }
}
