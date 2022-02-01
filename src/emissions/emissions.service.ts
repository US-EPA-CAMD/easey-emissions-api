import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmissionsSubmissionsResponseDTO } from 'src/dto/emissions-submissions-response.dto';
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
  ): Promise<EmissionsSubmissionsResponseDTO> {
    const queryResult = await this.repository.getSubmissionProgress(periodDate);
    const responseDTO = new EmissionsSubmissionsResponseDTO();

    const date = new Date(periodDate);
    const month = new Date().getMonth();

    let quarter;
    if (queryResult === undefined) {
      if (
        ['dev', 'test', 'local-dev'].includes(
          this.configService.get<string>('app.env'),
        ) &&
        [0, 3, 6, 9].includes(month)
      ) {
        let year = date.getFullYear();
        if (month >= 0 && month <= 2) {
          quarter = 4;
          year--;
        } else if (month >= 3 && month <= 5) {
          quarter = 1;
        } else if (month >= 6 && month <= 8) {
          quarter = 2;
        } else {
          quarter = 3;
        }
        responseDTO.year = year;
        responseDTO.percentage = Math.floor(Math.random() * 100);
      } else {
        return undefined;
      }
    } else {
      const mappedResult = await this.map.one(queryResult);
      quarter = mappedResult.quarter;
      responseDTO.year = mappedResult.calendarYear;
      responseDTO.percentage = mappedResult.submittedPercentage;
    }

    switch (quarter) {
      case 1:
        responseDTO.quarterName = 'First';
        break;
      case 2:
        responseDTO.quarterName = 'Second';
        break;
      case 3:
        responseDTO.quarterName = 'Third';
        break;
      default:
        responseDTO.quarterName = 'Fourth';
    }

    return responseDTO;
  }
}
