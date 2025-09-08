import { ViewEntity } from 'typeorm';

import { EmissionsReviewGlobal } from './emissions-review.entity';

@ViewEntity({ name: 'camdecmps.vw_em_export_and_report' })
export class EmissionsReviewReportGlobal extends EmissionsReviewGlobal {}
