import { ViewEntity } from 'typeorm';

import { EmissionsReview } from './emissions-review.entity';

@ViewEntity({ name: 'camdecmpswks.vw_em_submit' })
export class EmissionsReviewSubmit extends EmissionsReview {}
