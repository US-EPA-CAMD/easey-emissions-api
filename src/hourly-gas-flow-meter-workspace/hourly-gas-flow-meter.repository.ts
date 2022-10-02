import { HrlyGasFlowMeter } from '../entities/workspace/hrly-gas-flow-meter.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(HrlyGasFlowMeter)
export class HourlyGasFlowMeterWorkspaceRepository extends Repository<
  HrlyGasFlowMeter
> {
  async export(hourIds: string[]) {
    const query = this.createQueryBuilder('hgfm')
      .leftJoinAndSelect('hgfm.component', 'c')
      .where(`hgfm.hourId IN (:...hourIds)`, {
        hourIds: hourIds,
      });
    return query.getMany();
  }
}
