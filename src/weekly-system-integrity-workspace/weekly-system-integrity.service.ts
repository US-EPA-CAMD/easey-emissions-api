import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import { randomUUID } from 'crypto';

import { WeeklySystemIntegrityWorkspaceRepository } from './weekly-system-integrity.repository';
import {
  WeeklySystemIntegrityDTO,
  WeeklySystemIntegrityImportDTO,
} from '../dto/weekly-system-integrity.dto';
import { WeeklySystemIntegrityMap } from '../maps/weekly-system-integrity.map';

@Injectable()
export class WeeklySystemIntegrityWorkspaceService {
  constructor(
    private readonly map: WeeklySystemIntegrityMap,
    private readonly repository: WeeklySystemIntegrityWorkspaceRepository,
  ) {}

  async export(
    weeklyTestSumIds: string[],
  ): Promise<WeeklySystemIntegrityDTO[]> {
    const results = await this.repository.find({
      where: { weeklyTestSumId: In(weeklyTestSumIds) },
    });

    if (!results) {
      return null;
    }
    return this.map.many(results);
  }

  async import(
    data: WeeklySystemIntegrityImportDTO,
    weeklyTestSumId: string,
    monitoringLocationId: string,
    reportingPeriodId: number,
  ) {
    return this.repository.save(
      this.repository.create({
        ...data,
        id: randomUUID(),
        weeklyTestSumId: weeklyTestSumId,
        monitoringLocationId: monitoringLocationId,
        reportingPeriodId: reportingPeriodId,
        gasLevelCode: data.gasLevelCode,
        referenceValue: data.referenceValue,
        measuredValue: data.measuredValue,
        apsIndicator: data.apsIndicator,
        systemIntegrityError: data.systemIntegrityError,
        addDate: new Date(),
        updateDate: new Date(),
      }),
    );
  }
}
