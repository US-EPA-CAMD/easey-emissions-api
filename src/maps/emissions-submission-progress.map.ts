import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { EmissionSubmissionsProgress } from '../entities/emissions-submission-progress.entity';
import { EmissionsSubmissionsProgressDTO } from '../dto/emissions-submission-progress.dto';

@Injectable()
export class EmissionSubmissionsProgressMap extends BaseMap<
  EmissionSubmissionsProgress,
  EmissionsSubmissionsProgressDTO
> {
  public async one(
    entity: EmissionSubmissionsProgress,
  ): Promise<EmissionsSubmissionsProgressDTO> {
    let quarterN;
    switch (+entity.quarter) {
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
      percentage: entity.submittedPercentage,
    };
  }
}
