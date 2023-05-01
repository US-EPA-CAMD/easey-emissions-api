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

@Injectable()
export class MatsMonitorHourlyValueWorkspaceService {
  private importedData = [];

  constructor(
    private readonly map: MatsMonitorHourlyValueMap,
    private readonly repository: MatsMonitorHourlyValueWorkspaceRepository,
    private readonly bulkLoadService: BulkLoadService,
  ) {}

  async export(hourIds: string[]): Promise<MatsMonitorHourlyValueDTO[]> {
    const results = await this.repository.export(hourIds);
    return this.map.many(results);
  }

  async importPrep(
    data: MatsMonitorHourlyValueImportDTO[],
    hourId: string,
    monitorLocationId: string,
    reportingPeriodId: number,
    identifiers: ImportIdentifiers,
  ): Promise<void> {
    if (data && data.length > 0) {
      for (const dataChunk of data) {
        this.importedData.push({
          id: randomUUID(),
          monitoringSystemId:
            identifiers.monitoringSystems?.[dataChunk.monitoringSystemId] ||
            null,
          unadjustedHourlyValue: dataChunk.unadjustedHourlyValue,
          percentAvailable: dataChunk.percentAvailable,
          parameterCode: dataChunk.parameterCode,
          modcCode: dataChunk.modcCode,
          componentId: identifiers.components?.[dataChunk.componentId] || null,
          hourId,
          monitoringLocationId: monitorLocationId,
          reportingPeriodId: reportingPeriodId,
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
        'camdecmpswks.mats_monitor_hrly_value',
        [
          'mats_mhv_id',
          'mon_sys_id',
          'unadjusted_hrly_value',
          'pct_available',
          'parameter_cd',
          'modc_cd',
          'component_id',
          'hour_id',
          'mon_loc_id',
          'rpt_period_id',
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
