import { Injectable } from '@nestjs/common';

import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import { HourlyOperatingDTO } from '../dto/hourly-operating.dto';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { HourlyOperatingWorkspaceRepository } from './hourly-operating.repository';
import { MonitorHourlyValueWorkspaceService } from '../monitor-hourly-value-workspace/monitor-hourly-value.service';
import { DerivedHourlyValueWorkspaceService } from '../derived-hourly-value-workspace/derived-hourly-value-workspace.service';
import { MatsMonitorHourlyValueWorkspaceService } from '../mats-monitor-hourly-value-workspace/mats-monitor-hourly-value.service';
import { MatsDerivedHourlyValueWorkspaceService } from '../mats-derived-hourly-value-workspace/mats-derived-hourly-value.service';

@Injectable()
export class HourlyOperatingWorkspaceService {
  constructor(
    private readonly map: HourlyOperatingMap,
    private readonly repository: HourlyOperatingWorkspaceRepository,
    private readonly monitorHourlyValueService: MonitorHourlyValueWorkspaceService,
    private readonly derivedHourlyValueService: DerivedHourlyValueWorkspaceService,
    private readonly matsMonitorHourlyValueService: MatsMonitorHourlyValueWorkspaceService,
    private readonly matsDerivedHourlyValueService: MatsDerivedHourlyValueWorkspaceService,
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
        this.derivedHourlyValueService.export(
          hourlyOperating.map(hourlyOperatingDatum => {
            return hourlyOperatingDatum.id;
          }),
        ),
        this.matsMonitorHourlyValueService.export(
          hourlyOperating?.map(i => i.id),
        ),
      ]);

      hourlyOperating?.forEach(hourlyOp => {
        hourlyOp.monitorHourlyValue = values[0].filter(
          i => i.hourId === hourlyOp.id,
        );
        hourlyOp.derivedHourlyValue = values[1].filter(derivedHourlyDatum => {
          return derivedHourlyDatum.hourId === hourlyOp.id;
        });
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
