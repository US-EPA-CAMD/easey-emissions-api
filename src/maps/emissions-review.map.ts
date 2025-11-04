import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { EmissionsReview } from '../entities/workspace/emissions-review.entity';
import { EmissionsReviewDTO } from '../dto/emissions-review.dto';
import { EmissionsReviewGlobal } from '../entities/emissions-review.entity';

@Injectable()
export class EmissionsReviewMap extends BaseMap<
  EmissionsReview | EmissionsReviewGlobal,
  EmissionsReviewDTO
> {
  public async one(
    entity: EmissionsReview | EmissionsReviewGlobal,
  ): Promise<EmissionsReviewDTO> {
    return {
      orisCode: entity.orisCode,
      facilityName: entity.facilityName,
      monPlanId: entity.monPlanId,
      configuration: entity.configuration,
      evalStatusCode: entity.evalStatusCode,
      evalStatusCodeDescription: entity.evalStatusCodeDescription,
      severityCode: entity.severityCode,
      severityDescription: entity.severityCodeDescription,
      submissionAvailabilityCode: entity.submissionAvailabilityCode,
      submissionAvailabilityCodeDescription:
        entity.submissionAvailabilityCodeDescription,
      userid: entity.userid,
      updateDate: entity.updateDate?.toISOString() ?? null,
      windowStatus: entity.windowStatus,
      windowExpiredDate:
        'windowExpiredDate' in entity
          ? (entity.windowExpiredDate?.toISOString() ?? null)
          : null,
      periodAbbreviation: entity.periodAbbreviation,
    };
  }
}
