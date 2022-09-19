import { Injectable } from '@nestjs/common';

import { HourlyGasFlowMeterWorkspaceRepository } from './hourly-gas-flow-meter.repository';
import { HourlyGasFlowMeterDTO } from '../dto/hourly-gas-flow-meter.dto';
import { HourlyGasFlowMeterMap } from '../maps/hourly-gas-flow-meter.map';

@Injectable()
export class HourlyGasFlowMeterWorkspaceService {
  constructor(
    private readonly map: HourlyGasFlowMeterMap,
    private readonly repository: HourlyGasFlowMeterWorkspaceRepository,
  ) {}

  async export(hourIds: string[]): Promise<HourlyGasFlowMeterDTO[]> {
    const results = await this.repository.export(hourIds);
    return this.map.many(results);
  }
}
