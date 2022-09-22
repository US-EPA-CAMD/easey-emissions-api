import { Injectable } from '@nestjs/common';

import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import { HourlyOperatingDTO } from '../dto/hourly-operating.dto';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { HourlyOperatingWorkspaceRepository } from './hourly-operating.repository';
import { MonitorHourlyValueWorkspaceService } from '../monitor-hourly-value-workspace/monitor-hourly-value.service';
import { DerivedHourlyValueWorkspaceService } from '../derived-hourly-value-workspace/derived-hourly-value-workspace.service';
import { MatsMonitorHourlyValueWorkspaceService } from '../mats-monitor-hourly-value-workspace/mats-monitor-hourly-value.service';
import { MatsDerivedHourlyValueWorkspaceService } from '../mats-derived-hourly-value-workspace/mats-derived-hourly-value.service';
import { isUndefinedOrNull } from '../utils/utils';
import { HourlyGasFlowMeterWorkspaceService } from '../hourly-gas-flow-meter-workspace/hourly-gas-flow-meter.service';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { HrlyOpData } from '../entities/workspace/hrly-op-data.entity';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';
import { HourlyFuelFlowWorkspaceService } from '../hourly-fuel-flow-workspace/hourly-fuel-flow-workspace.service';

@Injectable()
export class HourlyOperatingWorkspaceService {
  constructor(
    private readonly map: HourlyOperatingMap,
    private readonly repository: HourlyOperatingWorkspaceRepository,
    private readonly monitorHourlyValueService: MonitorHourlyValueWorkspaceService,
    private readonly derivedHourlyValueService: DerivedHourlyValueWorkspaceService,
    private readonly matsMonitorHourlyValueService: MatsMonitorHourlyValueWorkspaceService,
    private readonly matsDerivedHourlyValueService: MatsDerivedHourlyValueWorkspaceService,
    private readonly hourlyGasFlowMeterService: HourlyGasFlowMeterWorkspaceService,
    private readonly hourlyFuelFlowService: HourlyFuelFlowWorkspaceService,
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
    if (isUndefinedOrNull(monitoringLocationIds)) {
      return null;
    }

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
          hourlyOp.monitorHourlyValueData = values[0].filter(
            i => i.hourId === hourlyOp.id,
          );
          hourlyOp.derivedHourlyValueData = values[1].filter(
            derivedHourlyDatum => {
              return derivedHourlyDatum.hourId === hourlyOp.id;
            },
          );
          hourlyOp.matsMonitorHourlyValueData = values[2].filter(
            i => i.hourId === hourlyOp.id,
          );
          hourlyOp.matsDerivedHourlyValueData = values[3].filter(
            i => i.hourId === hourlyOp.id,
          );
          hourlyOp.hourlyGFMData = values[4].filter(
            i => i.hourId === hourlyOp.id,
          );
          hourlyOp.hourlyFuelFlowData = values[5].filter(
            i => i.hourId === hourlyOp.id,
          );
        });
      }
    }

    return hourlyOperating;
  }

  async import(
    emissionsImport: EmissionsImportDTO,
    monitoringLocationId: string,
    reportingPeriodId: number,
    identifiers: ImportIdentifiers,
  ) {
    // TODO Hourly Operating Import, Overwrite all on merge
    const hourlyOperatingData = [new HrlyOpData()];

    if (
      Array.isArray(emissionsImport.hourlyOperatingData) &&
      emissionsImport.hourlyOperatingData.length > 0
    )
      for (const hourlyOperatingDatum of hourlyOperatingData) {
        if (
          Array.isArray(hourlyOperatingDatum.matsMonitorHourlyValues) &&
          hourlyOperatingDatum.matsMonitorHourlyValues.length > 0
        )
          for (const matsMonitorHourlyValue of hourlyOperatingDatum.matsMonitorHourlyValues) {
            await this.matsMonitorHourlyValueService.import(
              matsMonitorHourlyValue,
              hourlyOperatingDatum.id,
              monitoringLocationId,
              reportingPeriodId,
              identifiers,
            );
          }
      }
  }
}
