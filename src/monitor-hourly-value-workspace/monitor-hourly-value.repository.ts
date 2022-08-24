import { Repository, EntityRepository } from 'typeorm';

import { MonitorHrlyValue } from '../entities/workspace/monitor-hrly-value.entity';

@EntityRepository(MonitorHrlyValue)
export class MonitorHourlyValueWorkspaceRepository extends Repository<
  MonitorHrlyValue
> {
  async export(hourIds: string[]) {
    const query = this.createQueryBuilder('mhv')
      .leftJoinAndSelect('mhv.monitorSystem', 'ms')
      .leftJoinAndSelect('mhv.component', 'c')
      .where(`mhv.hourId IN (:...hourIds)`, {
        hourIds: hourIds,
      });
    return query.getMany();
  }
}
