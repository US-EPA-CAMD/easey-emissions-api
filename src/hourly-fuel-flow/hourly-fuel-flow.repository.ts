import { EntityRepository, Repository } from 'typeorm';
import { HrlyFuelFlow } from '../entities/hrly-fuel-flow.entity';

@EntityRepository(HrlyFuelFlow)
export class HourlyFuelFlowRepository extends Repository<HrlyFuelFlow> {
  async export(hourlyOperatingIds: string[]) {
    return this.createQueryBuilder('hourlyFuelFlow')
      .where('hourlyFuelFlow.hour_id IN (:...hourlyOperatingIds)', {
        hourlyOperatingIds,
      })
      .getMany();
  }
}
