import { DataSet } from '../entities/dataset.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(DataSet)
export class EmissionsViewRepository extends Repository<DataSet> {
}
