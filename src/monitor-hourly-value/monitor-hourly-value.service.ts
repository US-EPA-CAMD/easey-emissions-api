import { Injectable } from '@nestjs/common';

import { MonitorHourlyValueMap } from '../maps/monitor-hourly-value.map';
import { MonitorHourlyValueRepository } from './monitor-hourly-value.repository';
import { MonitorHourlyValueDTO } from '../dto/monitor-hourly-value.dto';

@Injectable()
export class MonitorHourlyValueService {

  constructor(
    private readonly map: MonitorHourlyValueMap,
    private readonly repository: MonitorHourlyValueRepository,
  ) {}

  async export(hourIds: string[]): Promise<MonitorHourlyValueDTO[]> {
    const results = await this.repository.export(hourIds);
    return this.map.many(results);
  }
}
