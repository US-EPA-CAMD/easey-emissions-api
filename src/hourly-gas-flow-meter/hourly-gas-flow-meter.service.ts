import { Injectable } from '@nestjs/common';

import { HourlyGasFlowMeterRepository } from './hourly-gas-flow-meter.repository';
import { HourlyGasFlowMeterDTO } from '../dto/hourly-gas-flow-meter.dto';
import { HourlyGasFlowMeterMap } from '../maps/hourly-gas-flow-meter.map';

@Injectable()
export class HourlyGasFlowMeterService {

  constructor(
    private readonly map: HourlyGasFlowMeterMap,
    private readonly repository: HourlyGasFlowMeterRepository,
  ) {}

  async export(rptPeriodId: number, monLocIds: string[]): Promise<HourlyGasFlowMeterDTO[]> {
    const results = await this.repository.export(rptPeriodId, monLocIds);
    return this.map.many(results);
  }
}
