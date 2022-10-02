import { EntityRepository, Repository } from 'typeorm';
import { HrlyParamFuelFlow } from '../entities/workspace/hrly-param-fuel-flow.entity';

@EntityRepository(HrlyParamFuelFlow)
export class HourlyParameterFuelFlowWorkspaceRepository extends Repository<
  HrlyParamFuelFlow
> {
  async export(hourlyFuelFlowId: string) {
    return this.createQueryBuilder('hrlyParam')
      .innerJoinAndSelect('hrlyParam.monitorFormula', 'monitorFormula')
      .where('hrlyParam.hrly_fuel_flow_id = :hourlyFuelFlowId', {
        hourlyFuelFlowId,
      })
      .getMany();
  }
}
