import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { SamplingTrain } from '../entities/sampling-train.entity';

@Injectable()
export class SamplingTrainRepository extends Repository<SamplingTrain> {
  constructor(entityManager: EntityManager) {
    super(SamplingTrain, entityManager);
  }
}
