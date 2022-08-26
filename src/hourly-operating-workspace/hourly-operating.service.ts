import { Injectable } from '@nestjs/common';

import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import { HourlyOperatingDTO } from '../dto/hourly-operating.dto';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { HourlyOperatingWorkspaceRepository } from './hourly-operating.repository';
import { MonitorHourlyValueWorkspaceService } from '../monitor-hourly-value-workspace/monitor-hourly-value.service';
import { MatsMonitorHourlyValueWorkspaceService } from '../mats-monitor-hourly-value-workspace/mats-monitor-hourly-value.service';

@Injectable()
export class HourlyOperatingWorkspaceService {
  constructor(
    private readonly map: HourlyOperatingMap,
    private readonly repository: HourlyOperatingWorkspaceRepository,
    private readonly monitorHourlyValueService: MonitorHourlyValueWorkspaceService,
    private readonly matsMonitorHourlyValueService: MatsMonitorHourlyValueWorkspaceService,
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
