import { Injectable } from '@nestjs/common';

import { HourlyGasFlowMeterWorkspaceRepository } from './hourly-gas-flow-meter.repository';
import {
  HourlyGasFlowMeterDTO,
  HourlyGasFlowMeterImportDTO,
} from '../dto/hourly-gas-flow-meter.dto';
import { HourlyGasFlowMeterMap } from '../maps/hourly-gas-flow-meter.map';
import { randomUUID } from 'crypto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';

@Injectable()
export class HourlyGasFlowMeterWorkspaceService {
  constructor(
    private readonly map: HourlyGasFlowMeterMap,
    private readonly repository: HourlyGasFlowMeterWorkspaceRepository,
  ) {}

  async export(hourIds: string[]): Promise<HourlyGasFlowMeterDTO[]> {
    const results = await this.repository.export(hourIds);
    return this.map.many(results);
  }

  async import(
    data: HourlyGasFlowMeterImportDTO,
    hourId: string,
    monitoringLocationId: string,
    reportingPeriodId: number,
    identifiers: ImportIdentifiers,
  ) {
    return this.repository.save(
      this.repository.create({
        id: randomUUID(),
        hourId,
        componentId: identifiers?.components?.[data.componentId],
        monitoringLocationId,
        reportingPeriodId,
        beginEndHourFlag: data.beginEndHourFlag,
        hourlyGfmReading: data.hourlyGfmReading,
        avgHourlySamplingRate: data.avgHourlySamplingRate,
        samplingRateUom: data.samplingRateUom,
        hourlySfsrRatio: data.hourlySfsrRatio,
        addDate: new Date(),
        updateDate: new Date(),
      }),
    );
  }
}
