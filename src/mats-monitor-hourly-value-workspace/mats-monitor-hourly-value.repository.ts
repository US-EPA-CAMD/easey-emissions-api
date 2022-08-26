import { MatsMonitorHrlyValue } from '../entities/workspace/mats-monitor-hrly-value.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(MatsMonitorHrlyValue)
export class MatsMonitorHourlyValueWorkspaceRepository extends Repository<
  MatsMonitorHrlyValue
> {
  async export(hourIds: string[]) {
    const query = this.createQueryBuilder('mmhv')
      .leftJoinAndSelect('mmhv.monitorSystem', 'ms')
      .leftJoinAndSelect('mmhv.component', 'c')
      .where(`mmhv.hourId IN (:...hourIds)`, {
        hourIds: hourIds,
      });
    return query.getMany();
  }
}
