import { HttpStatus, Injectable } from '@nestjs/common';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { DeleteResult } from 'typeorm';
import { randomUUID } from 'crypto';

import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import {
  HourlyOperatingDTO,
  HourlyOperatingImportDTO,
} from '../dto/hourly-operating.dto';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { HourlyOperatingWorkspaceRepository } from './hourly-operating.repository';
import { MonitorHourlyValueWorkspaceService } from '../monitor-hourly-value-workspace/monitor-hourly-value.service';
import { DerivedHourlyValueWorkspaceService } from '../derived-hourly-value-workspace/derived-hourly-value-workspace.service';
import { MatsMonitorHourlyValueWorkspaceService } from '../mats-monitor-hourly-value-workspace/mats-monitor-hourly-value.service';
import { MatsDerivedHourlyValueWorkspaceService } from '../mats-derived-hourly-value-workspace/mats-derived-hourly-value.service';
import { isUndefinedOrNull } from '../utils/utils';
import { HourlyGasFlowMeterWorkspaceService } from '../hourly-gas-flow-meter-workspace/hourly-gas-flow-meter.service';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { HourlyFuelFlowWorkspaceService } from '../hourly-fuel-flow-workspace/hourly-fuel-flow-workspace.service';

export type HourlyOperatingCreate = HourlyOperatingImportDTO & {
  reportingPeriodId: number;
  monitoringLocationId: string;
  identifiers: ImportIdentifiers;
};

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

  async delete(id: string): Promise<DeleteResult> {
    return this.repository.delete({ id });
  }

  async import(
    emissionsImport: EmissionsImportDTO,
    data: HourlyOperatingCreate,
  ): Promise<HourlyOperatingDTO> {
    const result = await this.repository.save(
      this.repository.create({
        ...data,
        id: randomUUID(),
      }),
    );

    const promises = [];
    if (
      Array.isArray(emissionsImport.hourlyOperatingData) &&
      emissionsImport.hourlyOperatingData.length > 0
    ) {
      for (const hourlyOperatingDatum of emissionsImport.hourlyOperatingData) {
        hourlyOperatingDatum?.derivedHourlyValueData?.forEach(
          derivedHrlyValue =>
            promises.push(
              this.derivedHourlyValueService.import(
                derivedHrlyValue,
                result.id,
                data.monitoringLocationId,
                data.reportingPeriodId,
                data.identifiers,
              ),
            ),
        );

        hourlyOperatingDatum?.matsMonitorHourlyValueData?.forEach(
          matsMonitorHourlyValue =>
            promises.push(
              this.matsMonitorHourlyValueService.import(
                matsMonitorHourlyValue,
                result.id,
                data.monitoringLocationId,
                data.reportingPeriodId,
                data.identifiers,
              ),
            ),
        );

        hourlyOperatingDatum?.monitorHourlyValueData?.forEach(
          monitorHourlyValue =>
            promises.push(
              this.monitorHourlyValueService.import(
                monitorHourlyValue,
                result.id,
                data.monitoringLocationId,
                data.reportingPeriodId,
                data.identifiers,
              ),
            ),
        );

        hourlyOperatingDatum?.matsDerivedHourlyValueData?.forEach(matsDerivedHourlyValue=>{
          promises.push(this.matsDerivedHourlyValueService.import(
            matsDerivedHourlyValue,
            data.identifiers,
            result.id,
            data.monitoringLocationId,
            data.reportingPeriodId,
          ))
        })

        hourlyOperatingDatum?.hourlyFuelFlowData?.forEach(hourlyFuelFlow =>
          promises.push(
            this.hourlyFuelFlowService.import(
              hourlyFuelFlow,
              data,
              result.id,
              data.monitoringLocationId,
              data.reportingPeriodId,
              data.identifiers,
            ),
          ),
        );

        hourlyOperatingDatum?.hourlyGFMData?.forEach(hourlyGfmDatum => {
          promises.push(
            this.hourlyGasFlowMeterService.import(
              hourlyGfmDatum,
              result.id,
              data.monitoringLocationId,
              data.reportingPeriodId,
              data.identifiers,
            ),
          );
        });
      }
    }

    const settled = await Promise.allSettled(promises);

    for (const settledElement of settled) {
      if (settledElement.status === 'rejected') {
        throw new LoggingException(
          settledElement.reason.details,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    return this.map.one(result);
  }
}
