import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { withSlaveConnection } from '@us-epa-camd/easey-common';

import { MatsMonitorHourlyValueRepository } from './mats-monitor-hourly-value.repository';
import { MatsMonitorHourlyValueDTO } from '../dto/mats-monitor-hourly-value.dto';
import { MatsMonitorHourlyValueMap } from '../maps/mats-monitor-hourly-value.map';

@Injectable()
export class MatsMonitorHourlyValueService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly map: MatsMonitorHourlyValueMap,
    private readonly repository: MatsMonitorHourlyValueRepository,
  ) {}

  async export(rptPeriodId: number, monLocIds: string[]): Promise<MatsMonitorHourlyValueDTO[]> {
    return withSlaveConnection(this.dataSource, async () => {
      const results = await this.repository.export(rptPeriodId, monLocIds);
      return this.map.many(results);
    });
  }
}
