import { MonitorPlan } from '../entities/workspace/monitor-plan.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(MonitorPlan)
export class MonitorPlanWorkspaceRepository extends Repository<MonitorPlan> {
  async getMonitorPlansByLocationIds(
    monitoringLocationIds: string[],
  ): Promise<MonitorPlan[]> {
    const query = this.createQueryBuilder('mp')
      .innerJoinAndSelect('mp.locations', 'ml')
      .where('ml.id IN (:...monitoringLocationIds)', { monitoringLocationIds });
    return query.getMany();
  }
}
