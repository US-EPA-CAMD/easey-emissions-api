import { Injectable } from '@nestjs/common';
import { HourlyParameterFuelFlowRepository } from './hourly-parameter-fuel-flow.repository';
import { HourlyParameterFuelFlowMap } from '../maps/hourly-parameter-fuel-flow.map';
import { HourlyParamFuelFlowDTO } from '../dto/hourly-param-fuel-flow.dto';

@Injectable()
export class HourlyParameterFuelFlowService {

  constructor(
    private readonly map: HourlyParameterFuelFlowMap,
    private readonly repository: HourlyParameterFuelFlowRepository,
  ) {}

  async export(hourlyFuelFlowIds: string[]): Promise<HourlyParamFuelFlowDTO[]> {
    const hrlyParams = await this.repository.export(hourlyFuelFlowIds);

    return this.map.many(hrlyParams);
  }
}
