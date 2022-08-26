import { Injectable } from '@nestjs/common';
import { DerivedHourlyValueRepository } from './derived-hourly-value.repository';
import { DerivedHourlyValueMap } from './derived-hourly-value.map';
import { DerivedHrlyValue } from '../entities/derived-hrly-value.entity';

@Injectable()
export class DerivedHourlyValueService {
  constructor(
    private readonly repository: DerivedHourlyValueRepository,
    private readonly map: DerivedHourlyValueMap,
  ) {}

  async export(monitoringLocationIds: string[]) {
    const derivedHourlyValueData = await this.repository.export(
      monitoringLocationIds,
    );

    const promises = derivedHourlyValueData.map(data => {
      return this.map.one(data);
    });

    return (Promise.all(promises) as unknown) as Promise<DerivedHrlyValue[]>;
  }
}
