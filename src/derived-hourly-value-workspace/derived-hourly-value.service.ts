import { Injectable } from '@nestjs/common';
import { DerivedHourlyValueRepository } from './derived-hourly-value.repository';
import { DerivedHrlyValue } from '../entities/workspace/derived-hrly-value.entity';

@Injectable()
export class DerivedHourlyValueService {
  constructor(private readonly repository: DerivedHourlyValueRepository) {}

  async export(monitorLocationIds: string[]): Promise<DerivedHrlyValue[]> {
    return this.repository.export(monitorLocationIds);
  }
}
