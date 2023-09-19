import { EntityRepository, Repository } from 'typeorm';

import { EmissionsReviewSubmitGlobal } from '../entities/emissions-review-submit.entity';

@EntityRepository(EmissionsReviewSubmitGlobal)
export class EmissionsReviewSubmitGlobalRepository extends Repository<
EmissionsReviewSubmitGlobal
> {}
