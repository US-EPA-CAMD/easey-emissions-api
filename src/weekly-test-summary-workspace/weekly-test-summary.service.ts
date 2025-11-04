import { BadRequestException, Injectable } from '@nestjs/common';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { randomUUID } from 'crypto';
import { DeleteResult, EntityManager } from 'typeorm';

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
    trx?: EntityManager,
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
      ',',
      trx?.queryRunner,
    );

    for (const weeklyTestSummaryDatum of emissionsImport.weeklyTestSummaryData) {
      // Handle anyOf schema - either unitId OR stackPipeId (or both)
      const matchingLocations = monitoringLocations.filter(location => {
        if (weeklyTestSummaryDatum.unitId && weeklyTestSummaryDatum.stackPipeId) {
          return location.unit?.name === weeklyTestSummaryDatum.unitId &&
                 location.stackPipe?.name === weeklyTestSummaryDatum.stackPipeId;
        } else if (weeklyTestSummaryDatum.unitId) {
          return location.unit?.name === weeklyTestSummaryDatum.unitId;
        } else if (weeklyTestSummaryDatum.stackPipeId) {
          return location.stackPipe?.name === weeklyTestSummaryDatum.stackPipeId;
        }
        return false;
      });

      if (matchingLocations.length === 0) {
        throw new BadRequestException(
          `No location found for unitId: ${weeklyTestSummaryDatum.unitId}, stackPipeId: ${weeklyTestSummaryDatum.stackPipeId}`
        );
      }
      if (matchingLocations.length > 1) {
        throw new BadRequestException(
          'Multiple locations found - unable to determine unique location'
        );
      }
      const monitoringLocationId = matchingLocations[0].id;

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
        componentId: identifiers?.locations[monitoringLocationId]?.components?.[componentId] || null,
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

      // Pass transaction to child service for atomicity
      await this.weeklySystemIntegrityService.import(systemIntegrityObjects, trx);
    }
  }
}
