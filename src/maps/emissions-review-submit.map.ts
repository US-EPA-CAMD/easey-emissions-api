import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { EmissionsReviewSubmit } from '../entities/workspace/emissions-review-submit.entity';
import { EmissionsReviewSubmitDTO } from '../dto/emissions-review-submit.dto';
import { EmissionsReviewSubmitGlobal } from '../entities/emissions-review-submit.entity';

@Injectable()
export class EmissionsReviewSubmitMap extends BaseMap<
  EmissionsReviewSubmit,
  EmissionsReviewSubmitDTO
> {
  public async one(
    entity: EmissionsReviewSubmit | EmissionsReviewSubmitGlobal,
  ): Promise<EmissionsReviewSubmitDTO> {
    return {
      orisCode: entity.orisCode,
      facilityName: entity.facilityName,
      monPlanId: entity.monPlanId,
      configuration: entity.configuration,
      evalStatusCode: entity.evalStatusCode,
      evalStatusCodeDescription: entity.evalStatusCodeDescription,
      submissionAvailabilityCode: entity.submissionAvailabilityCode,
      submissionAvailabilityCodeDescription:
        entity.submissionAvailabilityCodeDescription,
      userid: entity.userid,
      updateDate: entity.updateDate?.toISOString() ?? null,
      windowStatus: entity.windowStatus,
      periodAbbreviation: entity.periodAbbreviation,
    };
  }
}
