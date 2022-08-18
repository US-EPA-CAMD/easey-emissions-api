import { Repository, EntityRepository } from 'typeorm';
import { MonitorHrlyValue } from '../entities/monitor-hrly-value.entity';

@EntityRepository(MonitorHrlyValue)
export class MonitorHourlyValueRepository extends Repository<
  MonitorHrlyValue
> {}
