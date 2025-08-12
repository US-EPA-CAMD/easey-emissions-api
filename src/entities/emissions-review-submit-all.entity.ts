import { ViewEntity } from 'typeorm';

import { EmissionsReviewSubmitGlobal } from './emissions-review-submit.entity';

@ViewEntity({ name: 'camdecmps.vw_em_eval_and_submit_all' })
export class EmissionsReviewSubmitAllGlobal extends EmissionsReviewSubmitGlobal {}
