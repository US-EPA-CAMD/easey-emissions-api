import { ViewEntity } from 'typeorm';

import { EmissionsReview } from './emissions-review.entity';

@ViewEntity({ name: 'camdecmpswks.vw_em_eval_and_submit' })
export class EmissionsReviewEvaluate extends EmissionsReview {}
