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

  async export(rptPeriodId: number, monLocIds: string[]) {
    return this.createQueryBuilder('hrlyParam')
      .leftJoinAndSelect('hrlyParam.monitorFormula', 'monitorFormula')
      .leftJoinAndSelect('hrlyParam.monitorSystem', 'ms')
      .where('hrlyParam.reportingPeriodId = :rptPeriodId', { rptPeriodId })
      .andWhere('hrlyParam.monitoringLocationId IN(:...monLocIds)', {
        monLocIds,
      })
      .getMany();
  }
}
