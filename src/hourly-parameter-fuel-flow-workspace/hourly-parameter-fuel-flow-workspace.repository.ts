import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { HrlyParamFuelFlow } from '../entities/workspace/hrly-param-fuel-flow.entity';

@Injectable()
export class HourlyParameterFuelFlowWorkspaceRepository extends Repository<
  HrlyParamFuelFlow
> {
  constructor(entityManager: EntityManager) {
    super(HrlyParamFuelFlow, entityManager);
  }

  async export(hourlyFuelFlowIds: string[]) {
    return this.createQueryBuilder('hrlyParam')
      .leftJoinAndSelect('hrlyParam.monitorFormula', 'monitorFormula')
      .leftJoinAndSelect('hrlyParam.monitorSystem', 'ms')
      .where('hrlyParam.hrly_fuel_flow_id IN (:...hourlyFuelFlowIds)', {
        hourlyFuelFlowIds,
      })
      .getMany();
  }
}
