import { Injectable } from '@nestjs/common';

import { HourlyGasFlowMeterWorkspaceRepository } from './hourly-gas-flow-meter.repository';
import {
  HourlyGasFlowMeterDTO,
  HourlyGasFlowMeterImportDTO,
} from '../dto/hourly-gas-flow-meter.dto';
import { HourlyGasFlowMeterMap } from '../maps/hourly-gas-flow-meter.map';
import { randomUUID } from 'crypto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';

@Injectable()
export class HourlyGasFlowMeterWorkspaceService {
  private importedData = [];

  constructor(
    private readonly map: HourlyGasFlowMeterMap,
    private readonly repository: HourlyGasFlowMeterWorkspaceRepository,
    private readonly bulkLoadService: BulkLoadService,
  ) {}

  async export(hourIds: string[]): Promise<HourlyGasFlowMeterDTO[]> {
    const results = await this.repository.export(hourIds);
    return this.map.many(results);
  }

  async importPrep(
    data: HourlyGasFlowMeterImportDTO[],
    hourId: string,
    monitorLocationId: string,
    reportingPeriodId: number,
    identifiers: ImportIdentifiers,
  ): Promise<void> {
    if (data && data.length > 0) {
      for (const dataChunk of data) {
        this.importedData.push({
          id: randomUUID(),
          hourId,
          componentId: identifiers?.components?.[dataChunk.componentId],
          monitorLocationId,
          reportingPeriodId,
          beginEndHourFlag: dataChunk.beginEndHourFlag,
          hourlyGfmReading: dataChunk.hourlyGfmReading,
          avgHourlySamplingRate: dataChunk.avgHourlySamplingRate,
          samplingRateUom: dataChunk.samplingRateUom,
          hourlySfsrRatio: dataChunk.hourlySfsrRatio,
          addDate: new Date().toISOString(),
          updateDate: new Date().toISOString(),
          userId: identifiers?.userId,
        });
      }
    }
  }

  async import(): Promise<void> {
    if (this.importedData.length > 0) {
      const bulkLoadStream = await this.bulkLoadService.startBulkLoader(
        'camdecmpswks.hrly_gas_flow_meter',
        [
          'hrly_gas_flow_meter_id',
          'hour_id',
          'component_id',
          'mon_loc_id',
          'rpt_period_id',
          'begin_end_hour_flg',
          'gfm_reading',
          'avg_sampling_rate',
          'sampling_rate_uom',
          'flow_to_sampling_ratio',
          'add_date',
          'update_date',
          'userid',
        ],
      );

      for (const obj of this.importedData) {
        bulkLoadStream.writeObject(obj);
      }

      bulkLoadStream.complete();
      await bulkLoadStream.finished;
    }
  }
}
