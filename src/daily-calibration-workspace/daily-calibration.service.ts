import { Injectable } from '@nestjs/common';
import { DeleteResult, In } from 'typeorm';

import {
  DailyCalibrationDTO,
  DailyCalibrationImportDTO,
} from '../dto/daily-calibration.dto';
import { DailyCalibrationMap } from '../maps/daily-calibration.map';
import { DailyCalibrationWorkspaceRepository } from './daily-calibration.repository';
import { randomUUID } from 'crypto';

export type DailyCalibrationCreate = DailyCalibrationImportDTO & {
  dailyTestSummaryId: string;
};

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

    if (!results) {
      return null;
    }

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
    parameters: DailyCalibrationCreate,
  ): Promise<DailyCalibrationDTO> {
    const result = await this.repository.save(
      this.repository.create({
        ...parameters,
        id: randomUUID(),
      }),
    );

    return this.map.one(result);
  }
}
