import { Injectable } from '@nestjs/common';

import { MatsMonitorHourlyValueWorkspaceRepository } from './mats-monitor-hourly-value.repository';
import {
  MatsMonitorHourlyValueDTO,
  MatsMonitorHourlyValueImportDTO,
} from '../dto/mats-monitor-hourly-value.dto';
import { MatsMonitorHourlyValueMap } from '../maps/mats-monitor-hourly-value.map';
import { randomUUID } from 'crypto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';

@Injectable()
export class MatsMonitorHourlyValueWorkspaceService {
  constructor(
    private readonly map: MatsMonitorHourlyValueMap,
    private readonly repository: MatsMonitorHourlyValueWorkspaceRepository,
    private readonly bulkLoadService: BulkLoadService,
  ) {}

  async export(hourIds: string[]): Promise<MatsMonitorHourlyValueDTO[]> {
    const results = await this.repository.export(hourIds);
    return this.map.many(results);
  }

  async buildObjectList(
    data: MatsMonitorHourlyValueImportDTO[],
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
        monitoringLocationId: monitorLocationId,
        reportingPeriodId: reportingPeriodId,
        parameterCode: dataChunk.parameterCode,
        monitoringSystemId:
          identifiers.monitoringSystems?.[dataChunk.monitoringSystemId] || null,
        componentId: identifiers.components?.[dataChunk.componentId] || null,
        unadjustedHourlyValue: dataChunk.unadjustedHourlyValue,
        modcCode: dataChunk.modcCode,
        percentAvailable: dataChunk.percentAvailable,
        userId: identifiers?.userId,
        addDate: currentTime,
        updateDate: currentTime,
      });
    }
  }

  async import(objectList: Array<object>): Promise<void> {
    if (objectList && objectList.length > 0) {
      const bulkLoadStream = await this.bulkLoadService.startBulkLoader(
        'camdecmpswks.mats_monitor_hrly_value',
        [
          'mats_mhv_id',
          'hour_id',
          'mon_loc_id',
          'rpt_period_id',
          'parameter_cd',
          'mon_sys_id',
          'component_id',
          'unadjusted_hrly_value',
          'modc_cd',
          'pct_available',
          'userid',
          'add_date',
          'update_date',
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
