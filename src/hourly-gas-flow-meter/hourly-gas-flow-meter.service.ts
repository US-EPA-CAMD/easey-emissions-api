import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { withSlaveConnection } from '@us-epa-camd/easey-common';

import { HourlyGasFlowMeterRepository } from './hourly-gas-flow-meter.repository';
import { HourlyGasFlowMeterDTO } from '../dto/hourly-gas-flow-meter.dto';
import { HourlyGasFlowMeterMap } from '../maps/hourly-gas-flow-meter.map';

@Injectable()
export class HourlyGasFlowMeterService {

  constructor(
    private readonly dataSource: DataSource,
    private readonly map: HourlyGasFlowMeterMap,
  ) {}

  async export(rptPeriodId: number, monLocIds: string[]): Promise<HourlyGasFlowMeterDTO[]> {
    return withSlaveConnection(this.dataSource, async (replicaManager: EntityManager) => {
      const hourlyGasFlowMeterRepository = new HourlyGasFlowMeterRepository(replicaManager);
      const results = await hourlyGasFlowMeterRepository.export(rptPeriodId, monLocIds);
      return this.map.many(results);
    });
  }
}
