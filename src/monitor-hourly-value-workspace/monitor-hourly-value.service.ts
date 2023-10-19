import { Injectable } from '@nestjs/common';

import { MonitorHourlyValueMap } from '../maps/monitor-hourly-value.map';
import { MonitorHourlyValueWorkspaceRepository } from './monitor-hourly-value.repository';
import {
  MonitorHourlyValueDTO,
  MonitorHourlyValueImportDTO,
} from '../dto/monitor-hourly-value.dto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';
import { randomUUID } from 'crypto';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';

@Injectable()
export class MonitorHourlyValueWorkspaceService {
  constructor(
    private readonly map: MonitorHourlyValueMap,
    private readonly repository: MonitorHourlyValueWorkspaceRepository,
    private readonly bulkLoadService: BulkLoadService,
  ) {}

  async export(hourIds: string[]): Promise<MonitorHourlyValueDTO[]> {
    const results = await this.repository.export(hourIds);
    return this.map.many(results);
  }

  async buildObjectList(
    data: MonitorHourlyValueImportDTO[],
    hourId: string,
    monitorLocationId: string,
    reportingPeriodId: number,
    identifiers: ImportIdentifiers,
    objectList: Array<object>,
    currentTime: string,
  ): Promise<void> {
    if (!data) {
      return;
    }
    for (const dataChunk of data) {
      objectList.push({
        id: randomUUID(),
        hourId,
        monitoringSystemId:
          identifiers.monitoringSystems?.[dataChunk.monitoringSystemId] || null,
        componentId:
          identifiers.components?.[dataChunk.componentId] || null,
        parameterCode: dataChunk.parameterCode,
        unadjustedHourlyValue: dataChunk.unadjustedHourlyValue,
        adjustedHourlyValue: dataChunk.adjustedHourlyValue,
        modcCode: dataChunk.modcCode,
        percentAvailable: dataChunk.percentAvailable,
        moistureBasis: dataChunk.moistureBasis,
        userId: identifiers?.userId,
        addDate: currentTime,
        updateDate: currentTime,
        reportingPeriodId: reportingPeriodId,
        monitoringLocationId: monitorLocationId,
      });
    }
  }

  async import(objectList: Array<object>): Promise<void> {
    if (objectList && objectList.length > 0) {
      const bulkLoadStream = await this.bulkLoadService.startBulkLoader(
        'camdecmpswks.monitor_hrly_value',
        [
          'monitor_hrly_val_id',
          'hour_id',
          'mon_sys_id',
          'component_id',
          'parameter_cd',
          'unadjusted_hrly_value',
          'adjusted_hrly_value',
          'modc_cd',
          'pct_available',
          'moisture_basis',
          'userid',
          'add_date',
          'update_date',
          'rpt_period_id',
          'mon_loc_id',
        ],
      );

      for (const slice of objectList) {
        bulkLoadStream.writeObject(slice);
      }

      bulkLoadStream.complete();
      await bulkLoadStream.finished;
    }
  }
}
