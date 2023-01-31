import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { WeeklyTestSummaryMap } from '../maps/weekly-test-summary.map';
import { WeeklyTestSummaryWorkspaceRepository } from './weekly-test-summary.repository';
import {
  WeeklyTestSummaryDTO,
  WeeklyTestSummaryImportDTO,
} from '../dto/weekly-test-summary.dto';
import { WeeklySystemIntegrityWorkspaceService } from '../weekly-system-integrity-workspace/weekly-system-integrity.service';
import { ImportIdentifiers } from '../emissions-workspace/emissions.service';

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
  ) {}
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

  async import(data: WeeklyTestSummaryCreate): Promise<WeeklyTestSummaryDTO> {
    const weeklyTestSummary = await this.repository.save(
      this.repository.create({
        ...data,
        id: randomUUID(),
        componentId: data.identifiers?.components?.[data.componentId],
      }),
    );

    if (data?.weeklySystemIntegrityData) {
      for (const weeklySystemIntegrity of data.weeklySystemIntegrityData) {
        await this.weeklySystemIntegrityService
          .import(
            weeklySystemIntegrity,
            weeklyTestSummary.id,
            data.monitoringLocationId,
            data.reportingPeriodId,
          )
          .then(data => {
            weeklyTestSummary.weeklySystemIntegrity = data;
          });
      }
    }

    return this.map.one(weeklyTestSummary);
  }
}
