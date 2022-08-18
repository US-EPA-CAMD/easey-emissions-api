import { Injectable } from '@nestjs/common';
import {
  DailyTestSummaryDTO,
  DailyTestSummaryImportDTO,
} from '../dto/daily-test-summary.dto';

import { DailyCalibrationWorkspaceService } from '../daily-calibration-workspace/daily-calibration.service';
import { DailyTestSummaryMap } from '../maps/daily-test-summary.map';
import { DailyTestSummaryWorkspaceRepository } from './daily-test-summary.repository';
import { DailyTestSummary } from '../entities/daily-test-summary.entity';
import { DailyCalibrationDTO } from '../dto/daily-calibration.dto';
import { DeleteResult } from 'typeorm';

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
    parameters: DailyTestSummaryImportDTO,
  ): Promise<DailyTestSummaryDTO> {
    const dailyTestSummary = new DailyTestSummary();

    const dailyCalibrationImports: Array<Promise<DailyCalibrationDTO>> = [];
    parameters.dailyCalibrationData.forEach(dailyCalibrationDatum => {
      dailyCalibrationImports.push(
        this.dailyCalibrationService.import(dailyCalibrationDatum),
      );
    });
    await Promise.all(dailyCalibrationImports);

    Object.keys(parameters).forEach(key => {
      dailyTestSummary[key] = parameters[key];
    });

    const result = await this.repository.save(dailyTestSummary);

    return this.map.one(result);
  }
}
