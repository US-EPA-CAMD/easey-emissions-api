import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { withSlaveConnection } from '@us-epa-camd/easey-common';

import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import { HourlyOperatingRepository } from './hourly-operating.repository';
import { HourlyOperatingDTO } from '../dto/hourly-operating.dto';
import { MonitorHourlyValueService } from '../monitor-hourly-value/monitor-hourly-value.service';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { DerivedHourlyValueService } from '../derived-hourly-value/derived-hourly-value.service';
import { ReportingPeriod } from '../entities/reporting-period.entity';
import { MatsMonitorHourlyValueService } from '../mats-monitor-hourly-value/mats-monitor-hourly-value.service';
import { MatsDerivedHourlyValueService } from '../mats-derived-hourly-value/mats-derived-hourly-value.service';
import { HourlyGasFlowMeterService } from '../hourly-gas-flow-meter/hourly-gas-flow-meter.service';
import { HourlyFuelFlowService } from '../hourly-fuel-flow/hourly-fuel-flow.service';

@Injectable()
export class HourlyOperatingService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly map: HourlyOperatingMap,
    private readonly repository: HourlyOperatingRepository,
    private readonly monitorHourlyValueService: MonitorHourlyValueService,
    private readonly derivedHourlyValueService: DerivedHourlyValueService,
    private readonly matsMonitorHourlyValueService: MatsMonitorHourlyValueService,
    private readonly matsDerivedHourlyValueService: MatsDerivedHourlyValueService,
    private readonly hourlyFuelFlowService: HourlyFuelFlowService,
    private readonly hourlyGasFlowMeterService: HourlyGasFlowMeterService,
  ) {}
  async getHourlyOpDataByLocationIds(
    monitoringLocationIds: string[],
    params: EmissionsParamsDTO,
  ): Promise<HourlyOperatingDTO[]> {
    return withSlaveConnection(this.dataSource, async () => {
      const results = await this.repository.export(
        monitoringLocationIds,
        params.year,
        params.quarter,
      );

      return this.map.many(results);
    });
  }

  async export(
    monitoringLocationIds: string[],
    params: EmissionsParamsDTO,
  ): Promise<HourlyOperatingDTO[]> {
    return withSlaveConnection(this.dataSource, async () => {
      const hourlyOperating = await this.getHourlyOpDataByLocationIds(
        monitoringLocationIds,
        params,
      );
      
      const reportingPeriod = await this.dataSource
        .getRepository(ReportingPeriod)
        .findOneBy({
          year: params.year,
          quarter: params.quarter,
        });

      if (!hourlyOperating.length) return [];

      const values = await Promise.all([
        this.monitorHourlyValueService.export(reportingPeriod.id, monitoringLocationIds),
        this.derivedHourlyValueService.export(reportingPeriod.id, monitoringLocationIds),
        this.matsMonitorHourlyValueService.export(reportingPeriod.id, monitoringLocationIds),
        this.matsDerivedHourlyValueService.export(reportingPeriod.id, monitoringLocationIds),
        this.hourlyGasFlowMeterService.export(reportingPeriod.id, monitoringLocationIds),
        this.hourlyFuelFlowService.export(reportingPeriod.id, monitoringLocationIds),
      ]);

      hourlyOperating.forEach(hourlyOp => {
        hourlyOp.monitorHourlyValueData =
          values?.[0]?.filter(i => i.hourId === hourlyOp.id) ?? [];
        hourlyOp.derivedHourlyValueData =
          values?.[1]?.filter(i => i.hourId === hourlyOp.id) ?? [];
        hourlyOp.matsMonitorHourlyValueData =
          values?.[2]?.filter(i => i.hourId === hourlyOp.id) ?? [];
        hourlyOp.matsDerivedHourlyValueData =
          values?.[3]?.filter(i => i.hourId === hourlyOp.id) ?? [];
        hourlyOp.hourlyGFMData =
          values?.[4]?.filter(i => i.hourId === hourlyOp.id) ?? [];
        hourlyOp.hourlyFuelFlowData =
          values?.[5]?.filter(i => i.hourId === hourlyOp.id) ?? [];
      });

      return hourlyOperating;
    });
  }
}
