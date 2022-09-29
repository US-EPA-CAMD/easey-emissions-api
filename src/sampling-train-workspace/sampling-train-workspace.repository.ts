import { EntityRepository, Repository } from 'typeorm';
import { SamplingTrain } from '../entities/workspace/sampling-train.entity';

@EntityRepository(SamplingTrain)
export class SamplingTrainWorkspaceRepository extends Repository<
  SamplingTrain
> {}
