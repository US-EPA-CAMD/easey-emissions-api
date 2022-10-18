import { MatsDerivedHrlyValue } from '../entities/workspace/mats-derived-hrly-value.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(MatsDerivedHrlyValue)
export class MatsDerivedHourlyValueWorkspaceRepository extends Repository<
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
