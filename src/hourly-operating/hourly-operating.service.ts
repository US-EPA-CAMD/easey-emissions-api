import { Injectable } from '@nestjs/common';

import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import { HourlyOperatingRepository } from './hourly-operating.repository';
import { HourlyOperatingDTO } from '../dto/hourly-operating.dto';
import { MonitorHourlyValueService } from '../monitor-hourly-value/monitor-hourly-value.service';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';

@Injectable()
export class HourlyOperatingService {
  constructor(
    private readonly map: HourlyOperatingMap,
    private readonly repository: HourlyOperatingRepository,
    private readonly monitorHourlyValueService: MonitorHourlyValueService,
  ) {}
  async getHourlyOpDataByLocationIds(
    monitoringLocationIds: string[], params: EmissionsParamsDTO
  ): Promise<HourlyOperatingDTO[]> {
    const results = await this.repository.export(monitoringLocationIds, params.year, params.quarter);

    return this.map.many(results);
  }

  async export(monitoringLocationIds: string[], params: EmissionsParamsDTO): Promise<HourlyOperatingDTO[]> {
    const hourlyOperating = await this.getHourlyOpDataByLocationIds(
      monitoringLocationIds, params
    );

    const monitorHourlyValue = await this.monitorHourlyValueService.export(
      hourlyOperating?.map(i => i.id),
    );

    hourlyOperating.forEach(hourlyOp => {
      hourlyOp.monitorHourlyValue = monitorHourlyValue.filter(
        i => i.hourId === hourlyOp.id,
      );
    });

    return hourlyOperating;
  }
}
