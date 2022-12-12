import { BaseEntity, ViewColumn, ViewEntity } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@ViewEntity({ name: 'camdecmpswks.vw_em_review_and_submit' })
export class EmissionsReviewSubmit extends BaseEntity {
  @ViewColumn({
    name: 'oris_code',
    transformer: new NumericColumnTransformer(),
  })
  orisCode: number;

  @ViewColumn({ name: 'facility_name' })
  facilityName: string;

  @ViewColumn({ name: 'mon_plan_id' })
  monPlanId: string;

  @ViewColumn({ name: 'configuration' })
  configuration: string;

  @ViewColumn({ name: 'eval_status_cd' })
  evalStatusCode: string;

  @ViewColumn({ name: 'submission_availability_cd' })
  submissionAvailabilityCode: string;

  @ViewColumn({ name: 'userid' })
  userid: string;

  @ViewColumn({ name: 'update_date' })
  updateDate: string;

  @ViewColumn({ name: 'window_status' })
  windowStatus: string;

  @ViewColumn({ name: 'period_abbreviation' })
  periodAbbreviation: string;
}
