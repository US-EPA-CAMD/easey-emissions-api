import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { EmissionsReviewSubmit } from '../entities/workspace/emissions-review-submit.entity';

@Injectable()
export class EmissionsReviewSubmitRepository extends Repository<
  EmissionsReviewSubmit
> {
  constructor(entityManager: EntityManager) {
    super(EmissionsReviewSubmit, entityManager);
  }
}
