import { Injectable } from '@nestjs/common';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { randomUUID } from 'crypto';

import { DailyCalibrationWorkspaceService } from '../daily-calibration-workspace/daily-calibration.service';
import {
  DailyTestSummaryDTO,
  DailyTestSummaryImportDTO,
} from '../dto/daily-test-summary.dto';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';
import { DailyTestSummaryMap } from '../maps/daily-test-summary.map';
import { DeleteCriteria } from '../types';
import { isUndefinedOrNull } from '../utils/utils';
import { DailyTestSummaryWorkspaceRepository } from './daily-test-summary.repository';

export type DailyTestSummaryCreate = DailyTestSummaryImportDTO & {
  reportingPeriodId: number;
  monitoringLocationId: string;
  identifiers: ImportIdentifiers;
};

@Injectable()
export class DailyTestSummaryWorkspaceService {
  constructor(
    private readonly map: DailyTestSummaryMap,
    private readonly repository: DailyTestSummaryWorkspaceRepository,
    private readonly dailyCalibrationService: DailyCalibrationWorkspaceService,
    private readonly bulkLoadService: BulkLoadService,
  ) {}

  async getDailyTestSummariesByLocationIds(
    monitoringLocationIds: string[],
    params: EmissionsParamsDTO,
  ): Promise<DailyTestSummaryDTO[]> {
    const results = await this.repository.export(
      monitoringLocationIds,
      params.year,
      params.quarter,
    );

    return this.map.many(results);
  }

  async delete(criteria: DeleteCriteria): Promise<void> {
    await this.repository.delete(criteria);
  }

  async export(
    monitoringLocationIds: string[],
    params: EmissionsParamsDTO,
  ): Promise<DailyTestSummaryDTO[]> {
    if (isUndefinedOrNull(monitoringLocationIds)) {
      return null;
    }

    const summaries = await this.getDailyTestSummariesByLocationIds(
      monitoringLocationIds,
      params,
    );

    const dailyCalibrations = await this.dailyCalibrationService.export(
      summaries?.map(i => i.id),
    );

    summaries?.forEach(s => {
      s.dailyCalibrationData =
        dailyCalibrations?.filter(i => i.dailyTestSumId === s.id) ?? [];
    });

    return summaries;
  }

  async import(
    emissionsImport: EmissionsImportDTO,
    monitoringLocations,
    reportingPeriodId,
    identifiers: ImportIdentifiers,
    currentTime: string,
  ): Promise<void> {
    if (
      !Array.isArray(emissionsImport?.dailyTestSummaryData) ||
      emissionsImport?.dailyTestSummaryData.length === 0
    ) {
      return;
    }

    const bulkLoadStream = await this.bulkLoadService.startBulkLoader(
      'camdecmpswks.daily_test_summary',
      [
        'daily_test_sum_id',
        'rpt_period_id',
        'mon_loc_id',
        'component_id',
        'daily_test_date',
        'daily_test_hour',
        'daily_test_min',
        'test_type_cd',
        'test_result_cd',
        'userid',
        'add_date',
        'update_date',
        'span_scale_cd',
        'mon_sys_id',
      ],
    );

    for (const dailyTestSummaryDatum of emissionsImport.dailyTestSummaryData) {
      const monitoringLocationId = monitoringLocations.filter(location => {
        return (
          location.unit?.name === dailyTestSummaryDatum.unitId ||
          location.stackPipe?.name === dailyTestSummaryDatum.stackPipeId
        );
      })[0].id;

      const uid = randomUUID();
      dailyTestSummaryDatum['id'] = uid;

      bulkLoadStream.writeObject({
        id: uid,
        rptPeriodId: reportingPeriodId,
        monLocId: monitoringLocationId,
        componentId:
          identifiers?.components?.[dailyTestSummaryDatum.componentId] || null,
        dailyTestDate: dailyTestSummaryDatum.date,
        dailyTestHour: dailyTestSummaryDatum.hour,
        dailyTestMin: dailyTestSummaryDatum.minute,
        testTypeCd: dailyTestSummaryDatum.testTypeCode,
        testResultCd: dailyTestSummaryDatum.testResultCode,
        userId: identifiers?.userId,
        addDate: currentTime,
        updateDate: currentTime,
        spanScaleCd: dailyTestSummaryDatum.spanScaleCode,
        monSysId:
          identifiers?.monitoringSystems?.[
            dailyTestSummaryDatum.monitoringSystemId
          ] || null,
      });
    }

    bulkLoadStream.complete();
    await bulkLoadStream.finished;

    if (bulkLoadStream.status === 'Complete') {
      const buildPromises = [];

      const dailyCalibrationObjects = [];

      for (const dailyTestSummaryDatum of emissionsImport.dailyTestSummaryData) {
        buildPromises.push(
          this.dailyCalibrationService.buildObjectList(
            dailyTestSummaryDatum.dailyCalibrationData,
            dailyTestSummaryDatum['id'],
            reportingPeriodId,
            identifiers,
            dailyCalibrationObjects,
            currentTime,
          ),
        );
      }
      await Promise.all(buildPromises);

      await this.dailyCalibrationService.import(dailyCalibrationObjects);
    }
  }
}
