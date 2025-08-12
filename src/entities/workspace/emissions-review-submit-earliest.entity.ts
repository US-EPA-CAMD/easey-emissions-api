import { ViewEntity } from 'typeorm';

import { EmissionsReviewSubmit } from './emissions-review-submit.entity';

@ViewEntity({ name: 'camdecmpswks.vw_em_eval_and_submit_earliest' })
export class EmissionsReviewSubmitEarliest extends EmissionsReviewSubmit {}

