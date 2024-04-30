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
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';

@Injectable()
export class MatsDerivedHourlyValueWorkspaceService {
  constructor(
    private readonly map: MatsDerivedHourlyValueMap,
    private readonly repository: MatsDerivedHourlyValueWorkspaceRepository,
    private readonly bulkLoadService: BulkLoadService,
  ) {}

  async export(hourIds: string[]): Promise<MatsDerivedHourlyValueDTO[]> {
    const matsDerivedHourlyValueData = await this.repository.export(hourIds);
    return this.map.many(matsDerivedHourlyValueData);
  }

  async buildObjectList(
    data: MatsDerivedHourlyValueImportDTO[],
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
        hourId: hourId,
        parameterCode: dataChunk.parameterCode,
        unadjustedHourlyValue: dataChunk.unadjustedHourlyValue,
        modcCode: dataChunk.modcCode,
        monFormId:
          identifiers?.locations[monitorLocationId]?.monitorFormulas?.[dataChunk.formulaId] || null,
        monLoc: monitorLocationId,
        rptPeriod: reportingPeriodId,
        userId: identifiers?.userId,
        addDate: currentTime,
        updateDate: currentTime,
      });
    }
  }

  async import(objectList: Array<object>): Promise<void> {
    if (objectList && objectList.length > 0) {
      const bulkLoadStream = await this.bulkLoadService.startBulkLoader(
        'camdecmpswks.mats_derived_hrly_value',
        [
          'mats_dhv_id',
          'hour_id',
          'parameter_cd',
          'unadjusted_hrly_value',
          'modc_cd',
          'mon_form_id',
          'mon_loc_id',
          'rpt_period_id',
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
