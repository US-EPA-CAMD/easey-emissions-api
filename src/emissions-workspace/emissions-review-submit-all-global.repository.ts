import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { EmissionsReviewSubmitAllGlobal } from '../entities/emissions-review-submit-all.entity';

@Injectable()
export class EmissionsReviewSubmitAllGlobalRepository extends Repository<
  EmissionsReviewSubmitAllGlobal
> {
  constructor(entityManager: EntityManager) {
    super(EmissionsReviewSubmitAllGlobal, entityManager);
  }
}
