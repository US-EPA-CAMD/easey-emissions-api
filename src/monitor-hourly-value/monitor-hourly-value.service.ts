import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { withSlaveConnection } from '@us-epa-camd/easey-common';

import { MonitorHourlyValueMap } from '../maps/monitor-hourly-value.map';
import { MonitorHourlyValueRepository } from './monitor-hourly-value.repository';
import { MonitorHourlyValueDTO } from '../dto/monitor-hourly-value.dto';

@Injectable()
export class MonitorHourlyValueService {

  constructor(
    private readonly dataSource: DataSource,
    private readonly map: MonitorHourlyValueMap,
    private readonly repository: MonitorHourlyValueRepository,
  ) {}

  async export(rptPeriodId: number, monLocIds: string[]): Promise<MonitorHourlyValueDTO[]> {
    return withSlaveConnection(this.dataSource, async () => {
      const results = await this.repository.export(rptPeriodId, monLocIds);
      return this.map.many(results);
    });
  }
}
