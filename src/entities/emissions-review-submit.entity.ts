import { BaseEntity, ViewColumn, ViewEntity } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@ViewEntity({ name: 'camdecmps.vw_em_eval_and_submit' })
export class EmissionsReviewSubmitGlobal extends BaseEntity {
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

  evalStatusCode: string;

  evalStatusCodeDescription: string;

  submissionAvailabilityCode: string;

  submissionAvailabilityCodeDescription: string;

  @ViewColumn({ name: 'userid' })
  userid: string;

  @ViewColumn({ name: 'update_date' })
  updateDate: Date;

  @ViewColumn({ name: 'window_status' })
  windowStatus: string;

  @ViewColumn({ name: 'period_abbreviation' })
  periodAbbreviation: string;
}
