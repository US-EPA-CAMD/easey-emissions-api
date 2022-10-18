import { EntityRepository, Repository } from 'typeorm';
import { DerivedHrlyValue } from '../entities/workspace/derived-hrly-value.entity';

@EntityRepository(DerivedHrlyValue)
export class DerivedHourlyValueWorkspaceRepository extends Repository<
  DerivedHrlyValue
> {
  async export(hourIds: string[]): Promise<DerivedHrlyValue[]> {
    return this.createQueryBuilder('DerivedHrlyValue')
      .where('DerivedHrlyValue.hour_id IN(:...hourIds)', {
        hourIds,
      })
      .leftJoinAndSelect('DerivedHrlyValue.monitorSystem', 'monitorSystem')
      .leftJoinAndSelect('DerivedHrlyValue.monitorFormula', 'monitorFormula')
      .getMany();
  }
}
