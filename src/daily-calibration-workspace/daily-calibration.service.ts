import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';

import { DailyCalibrationDTO } from '../dto/daily-calibration.dto';
import { DailyCalibrationMap } from '../maps/daily-calibration.map';
import { DailyCalibrationWorkspaceRepository } from './daily-calibration.repository';

@Injectable()
export class DailyCalibrationWorkspaceService {
  constructor(
    private readonly map: DailyCalibrationMap,
    private readonly repository: DailyCalibrationWorkspaceRepository,
  ) {}

  async dailyCalibrationByTestSumId(
    dailyTestSummaryIds: string[],
  ): Promise<DailyCalibrationDTO[]> {
    const results = await this.repository.find({
      where: { dailyTestSummaryId: In(dailyTestSummaryIds) },
    });
    return this.map.many(results);
  }

  async export(dailyTestSummaryIds: string[]): Promise<DailyCalibrationDTO[]> {
    return this.dailyCalibrationByTestSumId(dailyTestSummaryIds);
  }
}
