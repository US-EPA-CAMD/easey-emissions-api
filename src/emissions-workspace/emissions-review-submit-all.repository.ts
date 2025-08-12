import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { EmissionsReviewSubmitAll } from '../entities/workspace/emissions-review-submit-all.entity';

@Injectable()
export class EmissionsReviewSubmitAllRepository extends Repository<
  EmissionsReviewSubmitAll
> {
  constructor(entityManager: EntityManager) {
    super(EmissionsReviewSubmitAll, entityManager);
  }
}

