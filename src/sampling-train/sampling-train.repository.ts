import { EntityRepository, Repository } from 'typeorm';
import { SamplingTrain } from '../entities/sampling-train.entity';

@EntityRepository(SamplingTrain)
export class SamplingTrainRepository extends Repository<SamplingTrain> {}
