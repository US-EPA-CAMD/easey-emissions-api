import { Injectable } from '@nestjs/common';
import { withSlaveConnection } from '@us-epa-camd/easey-common';
import { DataSource } from 'typeorm';

import { HourlyParameterFuelFlowRepository } from './hourly-parameter-fuel-flow.repository';
import { HourlyParameterFuelFlowMap } from '../maps/hourly-parameter-fuel-flow.map';
import { HourlyParamFuelFlowDTO } from '../dto/hourly-param-fuel-flow.dto';

@Injectable()
export class HourlyParameterFuelFlowService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly map: HourlyParameterFuelFlowMap,
    private readonly repository: HourlyParameterFuelFlowRepository,
  ) {}

  async export(
    rptPeriodId: number,
    monLocIds: string[],
  ): Promise<HourlyParamFuelFlowDTO[]> {
    return withSlaveConnection(this.dataSource, async () => {
      const hrlyParams = await this.repository.export(rptPeriodId, monLocIds);
      return this.map.many(hrlyParams);
    });
  }
}
