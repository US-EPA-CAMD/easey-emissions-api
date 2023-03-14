import { Injectable } from '@nestjs/common';

import { MonitorHourlyValueMap } from '../maps/monitor-hourly-value.map';
import { MonitorHourlyValueWorkspaceRepository } from './monitor-hourly-value.repository';
import {
  MonitorHourlyValueDTO,
  MonitorHourlyValueImportDTO,
} from '../dto/monitor-hourly-value.dto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';
import { randomUUID } from 'crypto';

@Injectable()
export class MonitorHourlyValueWorkspaceService {
  constructor(
    private readonly map: MonitorHourlyValueMap,
    private readonly repository: MonitorHourlyValueWorkspaceRepository,
  ) {}

  async export(hourIds: string[]): Promise<MonitorHourlyValueDTO[]> {
    const results = await this.repository.export(hourIds);
    return this.map.many(results);
  }

  async import(
    data: MonitorHourlyValueImportDTO,
    hourId: string,
    monitoringLocationId: string,
    reportingPeriodId: number,
    identifiers: ImportIdentifiers,
  ) {
    return this.repository.save(
      this.repository.create({
        id: randomUUID(),
        monitoringSystemId:
          identifiers.monitoringSystems?.[data.monitoringSystemId],
        parameterCode: data.parameterCode,
        unadjustedHourlyValue: data.unadjustedHourlyValue,
        modcCode: data.modcCode,
        componentId: identifiers.components?.[data.componentId],
        percentAvailable: data.percentAvailable,
        moistureBasis: data.moistureBasis,
        monitoringLocationId: monitoringLocationId,
        reportingPeriodId: reportingPeriodId,
        hourId,
        addDate: new Date(),
        updateDate: new Date(),
      }),
    );
  }
}
