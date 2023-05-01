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

@Injectable()
export class MonitorHourlyValueWorkspaceService {
  private importedData = [];

  constructor(
    private readonly map: MonitorHourlyValueMap,
    private readonly repository: MonitorHourlyValueWorkspaceRepository,
    private readonly bulkLoadService: BulkLoadService,
  ) {}

  async export(hourIds: string[]): Promise<MonitorHourlyValueDTO[]> {
    const results = await this.repository.export(hourIds);
    return this.map.many(results);
  }

  async importPrep(
    data: MonitorHourlyValueImportDTO[],
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
          parameterCode: dataChunk.parameterCode,
          unadjustedHourlyValue: dataChunk.unadjustedHourlyValue,
          modcCode: dataChunk.modcCode,
          componentId: identifiers.components?.[dataChunk.componentId] || null,
          percentAvailable: dataChunk.percentAvailable,
          moistureBasis: dataChunk.moistureBasis,
          monitoringLocationId: monitorLocationId,
          reportingPeriodId: reportingPeriodId,
          hourId,
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

      for (const obj of this.importedData) {
        bulkLoadStream.writeObject(obj);
      }

      bulkLoadStream.complete();
      await bulkLoadStream.finished;
    }
  }
}
