import { Injectable } from '@nestjs/common';
import {
  DailyTestSummaryDTO,
  DailyTestSummaryImportDTO,
} from '../dto/daily-test-summary.dto';

import { DailyCalibrationWorkspaceService } from '../daily-calibration-workspace/daily-calibration.service';
import { DailyTestSummaryMap } from '../maps/daily-test-summary.map';
import { DailyTestSummaryWorkspaceRepository } from './daily-test-summary.repository';
import { DeleteResult } from 'typeorm';
import { randomUUID } from 'crypto';
import { DailyCalibrationImportDTO } from '../dto/daily-calibration.dto';

export type DailyTestSummaryCreate = DailyTestSummaryImportDTO & {
  reportingPeriodId: number;
  monitoringLocationId: string;
};

@Injectable()
export class DailyTestSummaryWorkspaceService {
  constructor(
    private readonly map: DailyTestSummaryMap,
    private readonly repository: DailyTestSummaryWorkspaceRepository,
    private readonly dailyCalibrationService: DailyCalibrationWorkspaceService,
  ) {}

  async getDailyTestSummariesByLocationIds(
    monitoringLocationIds: string[],
  ): Promise<DailyTestSummaryDTO[]> {
    const results = await this.repository.export(monitoringLocationIds);

    return this.map.many(results);
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.repository.delete({ id });
  }

  async export(
    monitoringLocationIds: string[],
  ): Promise<DailyTestSummaryDTO[]> {
    const summaries = await this.getDailyTestSummariesByLocationIds(
      monitoringLocationIds,
    );

    const dailyCalibrations = await this.dailyCalibrationService.export(
      summaries?.map(i => i.id),
    );

    summaries.forEach(s => {
      s.dailyCalibrationData = dailyCalibrations.filter(
        i => i.dailyTestSumId === s.id,
      );
    });

    return summaries;
  }

  async import(
    parameters: DailyTestSummaryCreate,
  ): Promise<DailyTestSummaryDTO> {
    const result = await this.repository.save(
      this.repository.create({
        ...parameters,
        id: randomUUID(),
      }),
    );

    if (Array.isArray(parameters.dailyCalibrationData)) {
      await this.importDailyCalibrations(
        parameters.dailyCalibrationData,
        result.id,
      );
    }

    return this.map.one(result);
  }

  async importDailyCalibrations(
    dailyCalibrations: Array<DailyCalibrationImportDTO>,
    dailyTestSummaryId: string,
  ) {
    const dailyCalibrationImports = dailyCalibrations?.map(
      dailyCalibrationDatum => {
        return this.dailyCalibrationService.import({
          ...dailyCalibrationDatum,
          dailyTestSummaryId,
        });
      },
    );
    await Promise.all(dailyCalibrationImports);
  }
}
