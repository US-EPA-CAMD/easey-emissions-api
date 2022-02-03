import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmissionsSubmissionsProgressDTO } from 'src/dto/emissions-submission-progress.dto';
import { EmissionSubmissionsProgress } from '../entities/emissions-submission-progress.entity';
import { EmissionSubmissionsProgressMap } from '../maps/emissions-submission-progress.map';
import { EmissionsRepository } from './emissions.repository';

@Injectable()
export class EmissionService {
  constructor(
    private readonly map: EmissionSubmissionsProgressMap,
    private readonly repository: EmissionsRepository,
    private readonly configService: ConfigService,
  ) {}

  async getSubmissionProgress(
    periodDate: Date,
  ): Promise<EmissionsSubmissionsProgressDTO> {
    let queryResult = await this.repository.getSubmissionProgress(periodDate);

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
        queryResult = new EmissionSubmissionsProgress();

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

    return this.map.one(queryResult);
  }
}
