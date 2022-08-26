import { EntityRepository, Repository } from 'typeorm';
import { DerivedHrlyValue } from '../entities/derived-hrly-value.entity';

@EntityRepository(DerivedHrlyValue)
export class DerivedHourlyValueRepository extends Repository<DerivedHrlyValue> {
  async export(monitoringLocationIds: string[]): Promise<DerivedHrlyValue[]> {
    return this.createQueryBuilder('DerivedHrlyValue')
      .where('DerivedHrlyValue.mon_loc_id IN(:...monitoringLocationIds)', {
        monitoringLocationIds,
      })
      .innerJoinAndSelect('DerivedHrlyValue.mon_sys_id', 'monitorSystem')
      .getMany();
  }
}
