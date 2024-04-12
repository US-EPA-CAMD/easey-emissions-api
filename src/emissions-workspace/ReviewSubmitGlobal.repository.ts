import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { EmissionsReviewSubmitGlobal } from '../entities/emissions-review-submit.entity';

@Injectable()
export class EmissionsReviewSubmitGlobalRepository extends Repository<
  EmissionsReviewSubmitGlobal
> {
  constructor(entityManager: EntityManager) {
    super(EmissionsReviewSubmitGlobal, entityManager);
  }
}
