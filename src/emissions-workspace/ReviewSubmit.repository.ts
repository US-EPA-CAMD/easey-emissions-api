import { EntityRepository, Repository } from 'typeorm';

import { EmissionsReviewSubmit } from '../entities/workspace/emissions-review-submit.entity';

@EntityRepository(EmissionsReviewSubmit)
export class EmissionsReviewSubmitRepository extends Repository<
  EmissionsReviewSubmit
> {}
