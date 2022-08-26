import { EntityRepository, Repository } from 'typeorm';
import { HrlyOpData } from '../entities/workspace/hrly-op-data.entity';

@EntityRepository(HrlyOpData)
export class HourlyOperatingDataWorkspaceRepository extends Repository<
  HrlyOpData
> {
  async export(monitoringLocationIds): Promise<HrlyOpData[]> {
    return this.createQueryBuilder('HrlyOpData')
      .where('HrlyOpData.mon_loc_id IN(:...monitoringLocationIds)', {
        monitoringLocationIds,
      })
      .getMany();
  }
}
