import { Injectable } from '@nestjs/common';

import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import { HourlyOperatingRepository } from './hourly-operating.repository';
import { HourlyOperatingDTO } from '../dto/hourly-operating.dto';
import { MonitorHourlyValueService } from '../monitor-hourly-value/monitor-hourly-value.service';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { DerivedHourlyValueService } from '../derived-hourly-value/derived-hourly-value.service';
import { MatsMonitorHourlyValueService } from '../mats-monitor-hourly-value/mats-monitor-hourly-value.service';
import { MatsDerivedHourlyValueService } from '../mats-derived-hourly-value/mats-derived-hourly-value.service';

@Injectable()
export class HourlyOperatingService {
  constructor(
    private readonly map: HourlyOperatingMap,
    private readonly repository: HourlyOperatingRepository,
    private readonly monitorHourlyValueService: MonitorHourlyValueService,
    private readonly derivedHourlyValueService: DerivedHourlyValueService,
    private readonly matsMonitorHourlyValueService: MatsMonitorHourlyValueService,
    private readonly matsDerivedHourlyValueService: MatsDerivedHourlyValueService,
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
      const values = await Promise.all([
        this.monitorHourlyValueService.export(hourlyOperating.map(i => i.id)),
        this.derivedHourlyValueService.export(monitoringLocationIds),
        this.matsMonitorHourlyValueService.export(
          hourlyOperating?.map(i => i.id),
        ),
      ]);

      hourlyOperating?.forEach(hourlyOp => {
        hourlyOp.monitorHourlyValue = values[0].filter(
          i => i.hourId === hourlyOp.id,
        );
        hourlyOp.derivedHourlyValue = values[1];
        hourlyOp.matsMonitorHourlyValue = values[2].filter(
          i => i.hourId === hourlyOp.id,
        );
      });

      const matsDerivedHourlyValue = await this.matsDerivedHourlyValueService.export(
        hourlyOperating?.map(i => i.id),
      );

      hourlyOperating?.forEach(hourlyOp => {
        hourlyOp.matsDerivedHourlyValue = matsDerivedHourlyValue.filter(
          i => i.hourId === hourlyOp.id,
        );
      });
    }

    return hourlyOperating;
  }
}
