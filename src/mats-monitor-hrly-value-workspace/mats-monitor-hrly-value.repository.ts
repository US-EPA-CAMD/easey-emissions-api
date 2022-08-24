import { EntityRepository, Repository } from 'typeorm';
import { MatsMonitorHrlyValue } from '../entities/workspace/mats-monitor-hrly-value.entity';

@EntityRepository(MatsMonitorHrlyValue)
export class MatsMonitorHrlyValueRepository extends Repository<
  MatsMonitorHrlyValue
> {
  async export(
    monitoringLocationIds: string[],
  ): Promise<MatsMonitorHrlyValue[]> {
    return this.createQueryBuilder('MatsMonitorHrlyValue')
      .where('MatsMonitorHrlyValue.mon_loc_id IN (...:monitoringLocationIds', {
        monitoringLocationIds,
      })
      .getMany();
  }
}
