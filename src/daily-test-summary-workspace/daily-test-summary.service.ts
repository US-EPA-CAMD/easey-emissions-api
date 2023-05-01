import { HttpStatus, Injectable } from '@nestjs/common';
import {
  DailyTestSummaryDTO,
  DailyTestSummaryImportDTO,
} from '../dto/daily-test-summary.dto';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

import { DailyCalibrationWorkspaceService } from '../daily-calibration-workspace/daily-calibration.service';
import { DailyTestSummaryMap } from '../maps/daily-test-summary.map';
import { DailyTestSummaryWorkspaceRepository } from './daily-test-summary.repository';
import { FindConditions } from 'typeorm';
import { randomUUID } from 'crypto';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { isUndefinedOrNull } from '../utils/utils';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';
import { DailyTestSummary } from '../entities/workspace/daily-test-summary.entity';
import { EmissionsImportDTO } from '../dto/emissions.dto';

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

  async delete(
    criteria: FindConditions<DailyTestSummary>,
  ): Promise<void> {
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
  ): Promise<void> {
    if (
      !Array.isArray(emissionsImport?.dailyTestSummaryData) ||
      emissionsImport?.dailyTestSummaryData.length === 0
    ) {
      return;
    }

    const bulkLoadStream = await this.bulkLoadService.startBulkLoader(
      'camdecmpswks.daily_test_summary',
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
        calcTestResultCd: null,
        userId: identifiers?.userId,
        addDate: new Date().toISOString(),
        updateDate: new Date().toISOString(),
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
      const promises = [];

      for (const dailyTestSummaryDatum of emissionsImport.dailyTestSummaryData) {
        promises.push(
          this.dailyCalibrationService.importPrep(
            dailyTestSummaryDatum.dailyCalibrationData,
            dailyTestSummaryDatum['id'],
            reportingPeriodId,
            identifiers,
          ),
        );
      }

      const settled = await Promise.allSettled(promises);

      for (const settledElement of settled) {
        if (settledElement.status === 'rejected') {
          throw new LoggingException(
            settledElement.reason.detail,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }

      await this.dailyCalibrationService.import();
    }
  }
}
