import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { SamplingTrain } from '../entities/workspace/sampling-train.entity';

@Injectable()
export class SamplingTrainWorkspaceRepository extends Repository<
  SamplingTrain
> {
  constructor(entityManager: EntityManager) {
    super(SamplingTrain, entityManager);
  }
}
