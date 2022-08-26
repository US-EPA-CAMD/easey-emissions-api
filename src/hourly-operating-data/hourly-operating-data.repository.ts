import { EntityRepository, Repository } from 'typeorm';
import { HrlyOpData } from '../entities/hrly-op-data.entity';

@EntityRepository(HrlyOpData)
export class HourlyOperatingDataRepository extends Repository<HrlyOpData> {
  async export(monitoringLocationIds): Promise<HrlyOpData[]> {
    return this.createQueryBuilder('HrlyOpData')
      .where('HrlyOpData.mon_loc_id IN(:...monitoringLocationIds)', {
        monitoringLocationIds,
      })
      .getMany();
  }
}
