import { Repository, EntityRepository } from 'typeorm';
import { MonitorHrlyValue } from '../entities/monitor-hrly-value.entity';

@EntityRepository(MonitorHrlyValue)
export class MonitorHourlyValueRepository extends Repository<MonitorHrlyValue> {
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
