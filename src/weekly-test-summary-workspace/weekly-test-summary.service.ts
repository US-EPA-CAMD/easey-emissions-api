import { Injectable } from '@nestjs/common';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { randomUUID } from 'crypto';
import { DeleteResult } from 'typeorm';

import { EmissionsImportDTO } from '../dto/emissions.dto';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import {
  WeeklyTestSummaryDTO,
  WeeklyTestSummaryImportDTO,
} from '../dto/weekly-test-summary.dto';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';
import { WeeklyTestSummaryMap } from '../maps/weekly-test-summary.map';
import { DeleteCriteria } from '../types';
import { WeeklySystemIntegrityWorkspaceService } from '../weekly-system-integrity-workspace/weekly-system-integrity.service';
import { WeeklyTestSummaryWorkspaceRepository } from './weekly-test-summary.repository';

export type WeeklyTestSummaryCreate = WeeklyTestSummaryImportDTO & {
  reportingPeriodId: number;
  monitoringLocationId: string;
  identifiers: ImportIdentifiers;
};

@Injectable()
export class WeeklyTestSummaryWorkspaceService {
  constructor(
    private readonly map: WeeklyTestSummaryMap,
    private readonly repository: WeeklyTestSummaryWorkspaceRepository,
    private readonly weeklySystemIntegrityService: WeeklySystemIntegrityWorkspaceService,
    private readonly bulkLoadService: BulkLoadService,
  ) {}

  async delete(criteria: DeleteCriteria): Promise<DeleteResult> {
    return this.repository.delete(criteria);
  }

  async getWeeklyTestSummariesByLocationIds(
    monitoringLocationIds: string[],
    params: EmissionsParamsDTO,
  ): Promise<WeeklyTestSummaryDTO[]> {
    const results = await this.repository.export(
      monitoringLocationIds,
      params.year,
      params.quarter,
    );

    return this.map.many(results);
  }

  async export(
    monitoringLocationIds: string[],
    params: EmissionsParamsDTO,
  ): Promise<WeeklyTestSummaryDTO[]> {
    const weeklyTestSummaries = await this.getWeeklyTestSummariesByLocationIds(
      monitoringLocationIds,
      params,
    );

    if (weeklyTestSummaries) {
      const weeklySystemIntegrityData = await this.weeklySystemIntegrityService.export(
        weeklyTestSummaries?.map(i => i.id),
      );
      weeklyTestSummaries?.forEach(weeklyTestSum => {
        weeklyTestSum.weeklySystemIntegrityData =
          weeklySystemIntegrityData?.filter(
            i => i.weeklyTestSumId === weeklyTestSum.id,
          ) ?? [];
      });
    }
    return weeklyTestSummaries;
  }

  async import(
    emissionsImport: EmissionsImportDTO,
    monitoringLocations,
    reportingPeriodId,
    identifiers: ImportIdentifiers,
    currentTime: string,
  ): Promise<void> {
    if (
      !Array.isArray(emissionsImport?.weeklyTestSummaryData) ||
      emissionsImport?.weeklyTestSummaryData.length === 0
    ) {
      return;
    }

    const bulkLoadStream = await this.bulkLoadService.startBulkLoader(
      'camdecmpswks.weekly_test_summary',
      [
        'weekly_test_sum_id',
        'rpt_period_id',
        'mon_loc_id',
        'component_id',
        'test_date',
        'test_hour',
        'test_min',
        'test_type_cd',
        'test_result_cd',
        'span_scale_cd',
        'userid',
        'add_date',
        'update_date',
      ],
    );

    for (const weeklyTestSummaryDatum of emissionsImport.weeklyTestSummaryData) {
      const monitoringLocationId = monitoringLocations.filter(location => {
        return (
          location.unit?.name === weeklyTestSummaryDatum.unitId ||
          location.stackPipe?.name === weeklyTestSummaryDatum.stackPipeId
        );
      })[0].id;

      const uid = randomUUID();
      weeklyTestSummaryDatum['id'] = uid;
      weeklyTestSummaryDatum['locationId'] = monitoringLocationId;

      const {
        date,
        hour,
        minute,
        componentId,
        testTypeCode,
        testResultCode,
        spanScaleCode,
      } = weeklyTestSummaryDatum;

      bulkLoadStream.writeObject({
        uid,
        reportingPeriodId,
        monitoringLocationId,
        componentId: identifiers?.components?.[componentId] || null,
        date,
        hour,
        minute,
        testTypeCode,
        testResultCode,
        spanScaleCode,
        userId: identifiers?.userId,
        addDate: currentTime,
        updateDate: currentTime,
      });
    }

    bulkLoadStream.complete();
    await bulkLoadStream.finished;

    if (bulkLoadStream.status === 'Complete') {
      const buildPromises = [];

      const systemIntegrityObjects = [];

      for (const weeklyTestSummaryDatum of emissionsImport.weeklyTestSummaryData) {
        buildPromises.push(
          this.weeklySystemIntegrityService.buildObjectList(
            weeklyTestSummaryDatum.weeklySystemIntegrityData,
            weeklyTestSummaryDatum['id'],
            weeklyTestSummaryDatum['locationId'],
            reportingPeriodId,
            identifiers,
            systemIntegrityObjects,
            currentTime,
          ),
        );
      }

      await Promise.all(buildPromises);

      await this.weeklySystemIntegrityService.import(systemIntegrityObjects);
    }
  }
}
