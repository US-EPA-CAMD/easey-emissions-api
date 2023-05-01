import { Injectable } from '@nestjs/common';
import { DerivedHourlyValueWorkspaceRepository } from './derived-hourly-value-workspace.repository';
import { DerivedHourlyValueMap } from '../maps/derived-hourly-value.map';
import { randomUUID } from 'crypto';
import { DerivedHourlyValueImportDTO } from '../dto/derived-hourly-value.dto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';

@Injectable()
export class DerivedHourlyValueWorkspaceService {
  private importedData = [];

  constructor(
    private readonly repository: DerivedHourlyValueWorkspaceRepository,
    private readonly map: DerivedHourlyValueMap,
    private readonly bulkLoadService: BulkLoadService,
  ) {}

  async export(hourIds: string[]) {
    const derivedHourlyValueData = await this.repository.export(hourIds);

    const promises = derivedHourlyValueData?.map(data => {
      return this.map.one(data);
    });

    return Promise.all(promises);
  }

  async importPrep(
    data: DerivedHourlyValueImportDTO[],
    hourId: string,
    monitorLocationId: string,
    reportingPeriodId: number,
    identifiers: ImportIdentifiers,
  ): Promise<void> {
    if (data && data.length > 0) {
      for (const dataChunk of data) {
        this.importedData.push({
          id: randomUUID(),
          hourId: hourId,
          monSysId:
            identifiers?.monitoringSystems?.[dataChunk.monitoringSystemId] ||
            null,
          monFormId:
            identifiers?.monitorFormulas?.[dataChunk.formulaIdentifier] || null,
          parameterCode: dataChunk.parameterCode,
          unadjustedHrlyValue: dataChunk.unadjustedHourlyValue,
          adjustedHourlyValue: dataChunk.adjustedHourlyValue,
          modcCd: dataChunk.modcCode,
          opConditionCode: dataChunk.operatingConditionCode,
          pctAvailable: dataChunk.percentAvailable,
          segmentNum: dataChunk.segmentNumber,
          fuelCd: dataChunk.fuelCode,
          userId: identifiers?.userId,
          addDate: new Date().toISOString(),
          updateDate: new Date().toISOString(),
          rptPeriod: reportingPeriodId,
          monLocId: monitorLocationId,
        });
      }
    }
  }

  async import(): Promise<void> {
    if (this.importedData.length > 0) {
      const bulkLoadStream = await this.bulkLoadService.startBulkLoader(
        'camdecmpswks.derived_hrly_value',
        [
          'derv_id',
          'hour_id',
          'mon_sys_id',
          'mon_form_id',
          'parameter_cd',
          'unadjusted_hrly_value',
          'adjusted_hrly_value',
          'modc_cd',
          'operating_condition_cd',
          'pct_available',
          'segment_num',
          'fuel_cd',
          'userid',
          'add_date',
          'update_date',
          'rpt_period_id',
          'mon_loc_id',
        ]
      );

      for (const obj of this.importedData) {
        bulkLoadStream.writeObject(obj);
      }

      bulkLoadStream.complete();
      await bulkLoadStream.finished;
    }
  }
}
