import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { EmissionsSubmissionsProgress } from '../entities/vw-emissions-submissions-progress.entity';
import { EmissionsSubmissionsProgressDTO } from '../dto/emissions-submissions-progress.dto';

@Injectable()
export class EmissionsSubmissionsProgressMap extends BaseMap<
  EmissionsSubmissionsProgress,
  EmissionsSubmissionsProgressDTO
> {
  public async one(
    entity: EmissionsSubmissionsProgress,
  ): Promise<EmissionsSubmissionsProgressDTO> {
    let quarterN;
    switch (entity.quarter) {
      case 1:
        quarterN = 'First';
        break;
      case 2:
        quarterN = 'Second';
        break;
      case 3:
        quarterN = 'Third';
        break;
      default:
        quarterN = 'Fourth';
    }

    return {
      year: entity.calendarYear,
      quarterName: quarterN,
      quarter: entity.quarter,
      percentage: entity.submittedPercentage,//
    };
  }
}
