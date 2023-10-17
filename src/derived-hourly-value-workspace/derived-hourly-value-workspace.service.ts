import { Injectable } from '@nestjs/common';
import { DerivedHourlyValueWorkspaceRepository } from './derived-hourly-value-workspace.repository';
import { DerivedHourlyValueMap } from '../maps/derived-hourly-value.map';
import { randomUUID } from 'crypto';
import { DerivedHourlyValueImportDTO } from '../dto/derived-hourly-value.dto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';

@Injectable()
export class DerivedHourlyValueWorkspaceService {
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

  async buildObjectList(
    data: DerivedHourlyValueImportDTO[],
    hourId: string,
    monitorLocationId: string,
    reportingPeriodId: number,
    identifiers: ImportIdentifiers,
    buildObject: Array<object>,
    currentTime: string,
  ) {
    if (!data) {
      return;
    }
    for (const dataChunk of data) {
      buildObject.push({
        id: randomUUID(),
        hourId: hourId,
        monSysId:
          identifiers?.monitoringSystems?.[dataChunk.monitoringSystemId] || null,
        monFormId:
          identifiers?.monitorFormulas?.[dataChunk.formulaId] || null,
        parameterCode: dataChunk.parameterCode,
        unadjustedHrlyValue: dataChunk.unadjustedHourlyValue,
        adjustedHourlyValue: dataChunk.adjustedHourlyValue,
        modcCd: dataChunk.modcCode,
        opConditionCode: dataChunk.operatingConditionCode,
        pctAvailable: dataChunk.percentAvailable,
        segmentNum: dataChunk.segmentNumber,
        fuelCd: dataChunk.fuelCode,
        userId: identifiers?.userId,
        addDate: currentTime,
        updateDate: currentTime,
        rptPeriod: reportingPeriodId,
        monLocId: monitorLocationId,
      });
    }
  }

  async import(objectList: Array<object>): Promise<void> {
    if (objectList && objectList.length > 0) {
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
