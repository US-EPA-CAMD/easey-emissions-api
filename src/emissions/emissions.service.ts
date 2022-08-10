import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EmissionsSubmissionsProgressRepository } from './emissions-submissions-progress.repository';
import { EmissionsSubmissionsProgress } from '../entities/vw-emissions-submissions-progress.entity';
import { EmissionsSubmissionsProgressMap } from '../maps/emissions-submissions-progress.map';
import { EmissionsSubmissionsProgressDTO } from '../dto/emissions-submissions-progress.dto';
import { EmissionsRepository } from './emissions.repository';
import { EmissionsMap } from '../maps/emissions.map';
import { EmissionsDTO } from '../dto/emissions.dto';

@Injectable()
export class EmissionsService {
  constructor(
    private readonly map: EmissionsMap,
    private readonly repository: EmissionsRepository,
    private readonly submissionProgressMap: EmissionsSubmissionsProgressMap,
    private readonly submissionProgressRepo: EmissionsSubmissionsProgressRepository,
    private readonly configService: ConfigService,
  ) {}

  async export(
    monPlanId: string,
    year: number,
    quarter: number
  ): Promise<EmissionsDTO> {
    const result = await this.repository.export(monPlanId, year, quarter);
    //console.log(result);
    return this.map.one(result);
  }

  async getSubmissionProgress(
    periodDate: Date,
  ): Promise<EmissionsSubmissionsProgressDTO> {
    let queryResult = await this.submissionProgressRepo.getSubmissionProgress(
      periodDate,
      this.configService.get<number>('app.submissionDays'),
    );

    const date = new Date(periodDate);
    const month = date.getUTCMonth() + 1;

    if (queryResult === undefined) {
      if (
        ['development', 'test', 'local-dev'].includes(
          this.configService.get<string>('app.env'),
        ) &&
        ([1, 4, 7, 10].includes(month) ||
          ([2, 5, 8, 11].includes(month) && date.getUTCDate() <= 7))
      ) {
        queryResult = new EmissionsSubmissionsProgress();

        let year = date.getUTCFullYear();
        if (month >= 1 && month <= 3) {
          queryResult.quarter = 4;
          year--;
        } else if (month >= 4 && month <= 6) {
          queryResult.quarter = 1;
        } else if (month >= 7 && month <= 9) {
          queryResult.quarter = 2;
        } else {
          queryResult.quarter = 3;
        }
        queryResult.calendarYear = year;
        queryResult.submittedPercentage = Math.floor(Math.random() * 100);
      } else {
        return undefined;
      }
    }

    return this.submissionProgressMap.one(queryResult);
  }
}