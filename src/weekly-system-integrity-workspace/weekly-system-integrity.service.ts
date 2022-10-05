import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';

import { WeeklySystemIntegrityWorkspaceRepository } from './weekly-system-integrity.repository';
import { WeeklySystemIntegrityDTO } from '../dto/weekly-system-integrity.dto';
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
}
