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
  ): Promise<void> {
    for (const dataChunk of data) {
      objectList.push({
        id: randomUUID(),
        monitoringSystemId:
          identifiers.monitoringSystems?.[dataChunk.monitoringSystemId] || null,
        parameterCode: dataChunk.parameterCode,
        unadjustedHourlyValue: dataChunk.unadjustedHourlyValue,
        modcCode: dataChunk.modcCode,
        componentId: identifiers.components?.[dataChunk.componentId] || null,
        percentAvailable: dataChunk.percentAvailable,
        moistureBasis: dataChunk.moistureBasis,
        monitoringLocationId: monitorLocationId,
        reportingPeriodId: reportingPeriodId,
        hourId,
        addDate: currentDateTime().toISOString(),
        updateDate: currentDateTime().toISOString(),
        userId: identifiers?.userId,
      });
    }
  }

  async import(objectList: Array<object>): Promise<void> {
    if (objectList && objectList.length > 0) {
      const bulkLoadStream = await this.bulkLoadService.startBulkLoader(
        'camdecmpswks.monitor_hrly_value',
        [
          'monitor_hrly_val_id',
          'mon_sys_id',
          'parameter_cd',
          'unadjusted_hrly_value',
          'modc_cd',
          'component_id',
          'pct_available',
          'moisture_basis',
          'mon_loc_id',
          'rpt_period_id',
          'hour_id',
          'add_date',
          'update_date',
          'userid',
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
