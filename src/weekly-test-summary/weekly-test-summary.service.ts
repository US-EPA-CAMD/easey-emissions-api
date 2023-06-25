import { Injectable } from '@nestjs/common';

import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { WeeklyTestSummaryMap } from '../maps/weekly-test-summary.map';
import { WeeklyTestSummaryRepository } from './weekly-test-summary.repository';
import { WeeklyTestSummaryDTO } from '../dto/weekly-test-summary.dto';
import { WeeklySystemIntegrityService } from '../weekly-system-integrity/weekly-system-integrity.service';

@Injectable()
export class WeeklyTestSummaryService {

  constructor(
    private readonly map: WeeklyTestSummaryMap,
    private readonly repository: WeeklyTestSummaryRepository,
    private readonly weeklySystemIntegrityService: WeeklySystemIntegrityService,
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

  async removeNonReportedValues(weeklyTestSummaryData: WeeklyTestSummaryDTO[]) {
    const promises = [];
    weeklyTestSummaryData.forEach(dto => {
      promises.push(this.weeklySystemIntegrityService.removeNonReportedValues(dto.weeklySystemIntegrityData));
      delete dto.id;
      delete dto.monitoringLocationId;
      delete dto.reportingPeriodId;
      delete dto.monitoringSystemRecordId;
      delete dto.componentRecordId;
      delete dto.calcTestResultCode;
      delete dto.userId;
      delete dto.addDate;
      delete dto.updateDate;
    });

    await Promise.all(promises);
  }
}
