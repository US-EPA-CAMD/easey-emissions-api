import { Injectable } from '@nestjs/common';

import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import { HourlyOperatingRepository } from './hourly-operating.repository';
import { HourlyOperatingDTO } from '../dto/hourly-operating.dto';
import { MonitorHourlyValueService } from '../monitor-hourly-value/monitor-hourly-value.service';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { MatsMonitorHourlyValueService } from '../mats-monitor-hourly-value/mats-monitor-hourly-value.service';

@Injectable()
export class HourlyOperatingService {
  constructor(
    private readonly map: HourlyOperatingMap,
    private readonly repository: HourlyOperatingRepository,
    private readonly monitorHourlyValueService: MonitorHourlyValueService,
    private readonly matsMonitorHourlyValueService: MatsMonitorHourlyValueService,
  ) {}
  async getHourlyOpDataByLocationIds(
    monitoringLocationIds: string[],
    params: EmissionsParamsDTO,
  ): Promise<HourlyOperatingDTO[]> {
    const results = await this.repository.export(
      monitoringLocationIds,
      params.year,
      params.quarter,
    );

    return this.map.many(results);
  }

  async export(
    monitoringLocationIds: string[],
    params: EmissionsParamsDTO,
  ): Promise<HourlyOperatingDTO[]> {
    const hourlyOperating = await this.getHourlyOpDataByLocationIds(
      monitoringLocationIds,
      params,
    );

    if (hourlyOperating) {
      const monitorHourlyValue = await this.monitorHourlyValueService.export(
        hourlyOperating?.map(i => i.id),
      );

      hourlyOperating?.forEach(hourlyOp => {
        hourlyOp.monitorHourlyValue = monitorHourlyValue.filter(
          i => i.hourId === hourlyOp.id,
        );
      });

      const matsMonitorHourlyValue = await this.matsMonitorHourlyValueService.export(
        hourlyOperating?.map(i => i.id),
      );

      hourlyOperating?.forEach(hourlyOp => {
        hourlyOp.matsMonitorHourlyValue = matsMonitorHourlyValue.filter(
          i => i.hourId === hourlyOp.id,
        );
      });
    }

    return hourlyOperating;
  }
}
