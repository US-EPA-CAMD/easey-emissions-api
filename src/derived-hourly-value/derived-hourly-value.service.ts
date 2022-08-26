import { Injectable } from '@nestjs/common';
import { DerivedHourlyValueRepository } from './derived-hourly-value.repository';

@Injectable()
export class DerivedHourlyValueService {
  constructor(private readonly repository: DerivedHourlyValueRepository) {}

  async export(monitoringLocationIds: string[]) {
    return this.repository.export(monitoringLocationIds);
  }
}
