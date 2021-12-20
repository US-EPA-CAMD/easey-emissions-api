import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { EmissionSubmissionsProgress } from '../entities/emissions-submission-progress.entity'
import { EmissionsSubmissionsProgressDTO } from '../dto/emissions-submission-progress.dto';

@Injectable()
export class EmissionSubmissionsProgressMap extends BaseMap<EmissionSubmissionsProgress, EmissionsSubmissionsProgressDTO> {
  public async one(entity: EmissionSubmissionsProgress): Promise<EmissionsSubmissionsProgressDTO> {
    return {
      beginDate: entity.beginDate,
      endDate: entity.endDate,
      calendarYear: entity.calendarYear,
      quarter: entity.quarter,
      submittedPercentage: entity.submittedPercentage,
      submittedCount: entity.submittedCount,
      remainingCount: entity.remainingCount,
      totalExpectedCount: entity.totalExpectedCount,
      gdmUsedPercentage: entity.gdmUsedPercentage,
      gdmUsedCount: entity.gdmUsedCount,
      gdmRemainingCount: entity.gdmRemainingCount
    };
  }
}
