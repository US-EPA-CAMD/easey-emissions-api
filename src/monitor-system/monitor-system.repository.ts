import { EntityRepository, Repository } from 'typeorm';
import { MonitorSystem } from '../entities/monitor-system.entity';

@EntityRepository(MonitorSystem)
export class MonitorSystemRepository extends Repository<MonitorSystem> {
  async findOneByIdentifierAndLocation(
    systemIdentifier: string,
    monitoringLocationId: string,
  ) {
    return this.createQueryBuilder('monitorSystem')
      .where('monitorSystem.mon_loc_id = :monitoringLocationId', {
        monitoringLocationId,
      })
      .andWhere('monitorSystem.system_identifier = :systemIdentifier', {
        systemIdentifier,
      })
      .getOne();
  }
}
