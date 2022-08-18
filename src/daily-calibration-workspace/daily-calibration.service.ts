import { Injectable } from '@nestjs/common';
import { DeleteResult, In } from 'typeorm';

import {
  DailyCalibrationDTO,
  DailyCalibrationImportDTO,
} from '../dto/daily-calibration.dto';
import { DailyCalibrationMap } from '../maps/daily-calibration.map';
import { DailyCalibrationWorkspaceRepository } from './daily-calibration.repository';
import { DailyCalibration } from '../entities/daily-calibration.entity';

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

  async delete(id: string): Promise<DeleteResult> {
    return this.repository.delete({
      id,
    });
  }

  async export(dailyTestSummaryIds: string[]): Promise<DailyCalibrationDTO[]> {
    return this.dailyCalibrationByTestSumId(dailyTestSummaryIds);
  }

  async import(
    parameters: DailyCalibrationImportDTO,
  ): Promise<DailyCalibrationDTO> {
    const dailyCalibration = new DailyCalibration();

    Object.keys(parameters).forEach(key => {
      dailyCalibration[key] = parameters[key];
    });

    const result = await this.repository.save(dailyCalibration);

    return this.map.one(result);
  }
}
