import { ViewEntity } from 'typeorm';

import { EmissionsReview } from './emissions-review.entity';

@ViewEntity({ name: 'camdecmpswks.vw_em_export_and_report' })
export class EmissionsReviewReport extends EmissionsReview {}
