import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';

import { DailyCalibrationMap } from '../maps/daily-calibration.map';
import { DailyCalibrationRepository } from './daily-calibration.repository';
import { DailyCalibrationDTO } from '../dto/daily-calibration.dto';

@Injectable()
export class DailyCalibrationService {

  constructor(
    private readonly map: DailyCalibrationMap,
    private readonly repository: DailyCalibrationRepository,
  ) {}

  async dailyCalibrationByTestSumId(
    dailyTestSummaryIds: string[],
  ): Promise<DailyCalibrationDTO[]> {
    const results = await this.repository.find({
      where: { dailyTestSummaryId: In(dailyTestSummaryIds) },
    });

    if (!results) {
      return null;
    }

    return this.map.many(results);
  }

  async export(dailyTestSummaryIds: string[]): Promise<DailyCalibrationDTO[]> {
    return this.dailyCalibrationByTestSumId(dailyTestSummaryIds);
  }
}
