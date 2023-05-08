import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import { randomUUID } from 'crypto';

import { WeeklySystemIntegrityWorkspaceRepository } from './weekly-system-integrity.repository';
import {
  WeeklySystemIntegrityDTO,
  WeeklySystemIntegrityImportDTO,
} from '../dto/weekly-system-integrity.dto';
import { WeeklySystemIntegrityMap } from '../maps/weekly-system-integrity.map';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';

@Injectable()
export class WeeklySystemIntegrityWorkspaceService {
  constructor(
    private readonly map: WeeklySystemIntegrityMap,
    private readonly repository: WeeklySystemIntegrityWorkspaceRepository,
    private readonly bulkLoadService: BulkLoadService,
  ) {}

  async export(
    weeklyTestSumIds: string[],
  ): Promise<WeeklySystemIntegrityDTO[]> {
    const results = await this.repository.find({
      where: { weeklyTestSumId: In(weeklyTestSumIds) },
    });

    if (!results) {
      return null;
    }
    return this.map.many(results);
  }

  async buildObjectList(    
    data: WeeklySystemIntegrityImportDTO[],
    weekyTestSumId: string,
    monitoringLocationId: string,
    reportingPeriodId: number,
    identifiers: ImportIdentifiers,
    objectList: Array<object>,
    currentTime: string,
  ): Promise<void>{
    for (const dataChunk of data) {

      const {gasLevelCode, referenceValue, measuredValue, apsIndicator, systemIntegrityError,} = dataChunk;
      objectList.push({
        id: randomUUID(),
        weekyTestSumId,
        gasLevelCode,
        referenceValue,
        measuredValue,
        systemIntegrityError,
        apsIndicator,
        userId: identifiers?.userId,
        addDate: currentTime,
        updateDate: currentTime,
        rptPeriodId: reportingPeriodId,
        monitoringLocationId,
      });
    }

  } 

  async import(objectList: Array<object>): Promise<void> {
    if (objectList && objectList.length > 0) {
      const bulkLoadStream = await this.bulkLoadService.startBulkLoader(
        'camdecmpswks.weekly_system_integrity',
        [
          'weekly_sys_integrity_id',
          'weekly_test_sum_id',
          'gas_level_cd',
          'ref_value',
          'measured_value',
          'system_integrity_error',
          'aps_ind',
          'userid',
          'add_date',
          'update_date',
          'rpt_period_id',
          'mon_loc_id',
        ],
        '|',
      );

      for (const slice of objectList) {
        bulkLoadStream.writeObject(slice);
      }

      bulkLoadStream.complete();
      await bulkLoadStream.finished;
    }
  }
}
