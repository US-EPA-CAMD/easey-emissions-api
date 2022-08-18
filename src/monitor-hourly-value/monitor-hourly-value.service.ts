import { Injectable } from '@nestjs/common';
import { MonitorHourlyValueMap } from '../maps/monitor-hourly-value.map';
import { In } from 'typeorm';
import { MonitorHourlyValueRepository } from './monitor-hourly-value.repository';
import { MonitorHourlyValueDTO } from 'src/dto/monitor-hourly-value.dto';

@Injectable()
export class MonitorHourlyValueService {
  constructor(
    private readonly map: MonitorHourlyValueMap,
    private readonly repository: MonitorHourlyValueRepository,
  ) {}

  async monitorHourlyValueByHourIds(
    hourIds: string[],
  ): Promise<MonitorHourlyValueDTO[]> {
    const results = await this.repository.find({
      where: { hourId: In(hourIds) },
    });
    return this.map.many(results);
  }

  async export(hourIds: string[]): Promise<MonitorHourlyValueDTO[]> {
    return this.monitorHourlyValueByHourIds(hourIds);
  }
}
