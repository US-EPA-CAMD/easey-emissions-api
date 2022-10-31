import { Injectable } from '@nestjs/common';

import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import { HourlyOperatingRepository } from './hourly-operating.repository';
import { HourlyOperatingDTO } from '../dto/hourly-operating.dto';
import { MonitorHourlyValueService } from '../monitor-hourly-value/monitor-hourly-value.service';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { DerivedHourlyValueService } from '../derived-hourly-value/derived-hourly-value.service';
import { MatsMonitorHourlyValueService } from '../mats-monitor-hourly-value/mats-monitor-hourly-value.service';
import { MatsDerivedHourlyValueService } from '../mats-derived-hourly-value/mats-derived-hourly-value.service';
import { HourlyGasFlowMeterService } from '../hourly-gas-flow-meter/hourly-gas-flow-meter.service';
import { HourlyFuelFlowService } from '../hourly-fuel-flow/hourly-fuel-flow.service';
import { HourlyOperatingParamsDto } from '../dto/hourly-operating.params.dto';
import { exportSupplementaryHourlyOperatingData } from '../hourly-operating-functions/hourly-operating-export';

@Injectable()
export class HourlyOperatingService {
  constructor(
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
      const hourlyOperatingIds = hourlyOperating.map(i => i.id);

      if (hourlyOperatingIds?.length > 0) {
        const values = await Promise.all([
          this.monitorHourlyValueService.export(hourlyOperatingIds),
          this.derivedHourlyValueService.export(hourlyOperatingIds),
          this.matsMonitorHourlyValueService.export(hourlyOperatingIds),
          this.matsDerivedHourlyValueService.export(hourlyOperatingIds),
          this.hourlyGasFlowMeterService.export(hourlyOperatingIds),
          this.hourlyFuelFlowService.export(hourlyOperatingIds),
        ]);

        hourlyOperating?.forEach(hourlyOp => {
          hourlyOp.monitorHourlyValueData = values?.[0]?.filter(
            i => i.hourId === hourlyOp.id,
          );
          hourlyOp.derivedHourlyValueData = values?.[1]?.filter(
            derivedHourlyDatum => {
              return derivedHourlyDatum.hourId === hourlyOp.id;
            },
          );
          hourlyOp.matsMonitorHourlyValueData = values?.[2]?.filter(
            i => i.hourId === hourlyOp.id,
          );
          hourlyOp.matsDerivedHourlyValueData = values?.[3]?.filter(
            i => i.hourId === hourlyOp.id,
          );
          hourlyOp.hourlyGFMData = values?.[4]?.filter(
            i => i.hourId === hourlyOp.id,
          );
          hourlyOp.hourlyFuelFlowData = values?.[5]?.filter(
            i => i.hourId === hourlyOp.id,
          );
        });
      }
    }

    return hourlyOperating;
  }

  async supplementaryExport(
    params: HourlyOperatingParamsDto,
  ): Promise<HourlyOperatingDTO[]> {
    return exportSupplementaryHourlyOperatingData(params, this.repository);
  }
}
