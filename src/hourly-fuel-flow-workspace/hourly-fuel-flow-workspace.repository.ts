import { EntityRepository, Repository } from 'typeorm';
import { HrlyFuelFlow } from '../entities/workspace/hrly-fuel-flow.entity';

@EntityRepository(HrlyFuelFlow)
export class HourlyFuelFlowWorkspaceRepository extends Repository<
  HrlyFuelFlow
> {
  async export(hourlyOperatingIds: string[]) {
    return this.createQueryBuilder('hourlyFuelFlow')
      .where('hourlyFuelFlow.hour_id IN (:...hourlyOperatingIds)', {
        hourlyOperatingIds,
      })
      .getMany();
  }
}
