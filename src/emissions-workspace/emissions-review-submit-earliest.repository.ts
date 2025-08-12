import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { EmissionsReviewSubmitEarliest } from '../entities/workspace/emissions-review-submit-earliest.entity';

@Injectable()
export class EmissionsReviewSubmitEarliestRepository extends Repository<
  EmissionsReviewSubmitEarliest
> {
  constructor(entityManager: EntityManager) {
    super(EmissionsReviewSubmitEarliest, entityManager);
  }
}

