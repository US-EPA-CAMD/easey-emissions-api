import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';

import { WeeklySystemIntegrityRepository } from './weekly-system-integrity.repository';
import { WeeklySystemIntegrityDTO } from '../dto/weekly-system-integrity.dto';
import { WeeklySystemIntegrityMap } from '../maps/weekly-system-integrity.map';

@Injectable()
export class WeeklySystemIntegrityService {

  constructor(
    private readonly map: WeeklySystemIntegrityMap,
    private readonly repository: WeeklySystemIntegrityRepository,
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

  async removeNonReportedValues(weeklySystemIntegrityData: WeeklySystemIntegrityDTO[]) {
    weeklySystemIntegrityData.forEach(dto => {
      delete dto.id;
      delete dto.weeklyTestSumId;
      delete dto.reportingPeriodId;
      delete dto.calcSystemIntegrityError;
      delete dto.calcApsInd;
      delete dto.userId;
      delete dto.addDate;
      delete dto.updateDate;
    })
  }
}
