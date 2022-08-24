import { Injectable } from '@nestjs/common';
import { MatsMonitorHrlyValueRepository } from './mats-monitor-hrly-value.repository';
import { MatsMonitorHrlyValueDTO } from '../dto/mats-monitor-hrly-value.dto';

@Injectable()
export class MatsMonitorHrlyValueService {
  constructor(private readonly repository: MatsMonitorHrlyValueRepository) {}

  async export(
    monitorLocationIds: string[],
  ): Promise<MatsMonitorHrlyValueDTO[]> {
    return this.repository.export(monitorLocationIds);
  }
}
