import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { EmissionsReviewSubmit } from '../entities/emissions-review-submit.entity';
import { EmissionsReviewSubmitDTO } from '../dto/emissions-review-submit.dto';

@Injectable()
export class EmissionsReviewSubmitMap extends BaseMap<
  EmissionsReviewSubmit,
  EmissionsReviewSubmitDTO
> {
  public async one(
    entity: EmissionsReviewSubmit,
  ): Promise<EmissionsReviewSubmitDTO> {
    return {
      orisCode: entity.orisCode,
      facilityName: entity.facilityName,
      monPlanIdentifier: entity.monPlanIdentifier,
      configuration: entity.configuration,
      periodAbbreviation: entity.periodAbbreviation,
      emStatusCode: entity.emStatusCode,
      submissionAvailabilityCode: entity.submissionAvailabilityCode,
      userid: entity.userid,
      updateDate: entity.updateDate,
    };
  }
}
