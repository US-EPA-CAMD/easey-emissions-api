import { Injectable } from '@nestjs/common';

import { MatsMonitorHourlyValueWorkspaceRepository } from './mats-monitor-hourly-value.repository';
import {
  MatsMonitorHourlyValueDTO,
  MatsMonitorHourlyValueImportDTO,
} from '../dto/mats-monitor-hourly-value.dto';
import { MatsMonitorHourlyValueMap } from '../maps/mats-monitor-hourly-value.map';
import { randomUUID } from 'crypto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';

@Injectable()
export class MatsMonitorHourlyValueWorkspaceService {
  constructor(
    private readonly map: MatsMonitorHourlyValueMap,
    private readonly repository: MatsMonitorHourlyValueWorkspaceRepository,
  ) {}

  async export(hourIds: string[]): Promise<MatsMonitorHourlyValueDTO[]> {
    const results = await this.repository.export(hourIds);
    return this.map.many(results);
  }

  async import(
    data: MatsMonitorHourlyValueImportDTO,
    hourId: string,
    monitoringLocationId: string,
    reportingPeriodId: number,
    identifiers: ImportIdentifiers,
  ) {
    this.repository.save(
      this.repository.create({
        id: randomUUID(),
        monitoringSystemId:
          identifiers.monitoringSystems?.[data.monitoringSystemId],
        unadjustedHourlyValue: data.unadjustedHourlyValue,
        percentAvailable: data.percentAvailable,
        parameterCode: data.parameterCode,
        modcCode: data.modcCode,
        componentId: identifiers.components?.[data.componentId],
        hourId,
        monitoringLocationId: monitoringLocationId,
        reportingPeriodId: reportingPeriodId,
      }),
    );
  }
}
