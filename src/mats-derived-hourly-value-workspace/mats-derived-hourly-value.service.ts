import { Injectable } from '@nestjs/common';
import { MatsDerivedHourlyValueMap } from '../maps/mats-derived-hourly-value.map';
import { MatsDerivedHourlyValueWorkspaceRepository } from './mats-derived-hourly-value.repository';
import {
  MatsDerivedHourlyValueDTO,
  MatsDerivedHourlyValueImportDTO,
} from '../dto/mats-derived-hourly-value.dto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';
import { randomUUID } from 'crypto';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';

@Injectable()
export class MatsDerivedHourlyValueWorkspaceService {
  private importedData = [];

  constructor(
    private readonly map: MatsDerivedHourlyValueMap,
    private readonly repository: MatsDerivedHourlyValueWorkspaceRepository,
    private readonly bulkLoadService: BulkLoadService,
  ) {}

  async export(hourIds: string[]): Promise<MatsDerivedHourlyValueDTO[]> {
    const matsDerivedHourlyValueData = await this.repository.export(hourIds);
    return this.map.many(matsDerivedHourlyValueData);
  }

  async importPrep(
    data: MatsDerivedHourlyValueImportDTO[],
    hourId: string,
    monitorLocationId: string,
    reportingPeriodId: number,
    identifiers: ImportIdentifiers,
  ): Promise<void> {
    if (data && data.length > 0) {
      for (const dataChunk of data) {
        this.importedData.push({
          id: randomUUID(),
          parameterCode: dataChunk.parameterCode,
          unadjustedHourlyValue: dataChunk.unadjustedHourlyValue,
          modcCode: dataChunk.modcCode,
          monFormId:
            identifiers?.monitorFormulas?.[dataChunk.formulaIdentifier] || null,
          hourId: hourId,
          monLod: monitorLocationId,
          rptPeriod: reportingPeriodId,
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
        'camdecmpswks.mats_derived_hrly_value',
        [
          'mats_dhv_id',
          'parameter_cd',
          'unadjusted_hrly_value',
          'modc_cd',
          'mon_form_id',
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
