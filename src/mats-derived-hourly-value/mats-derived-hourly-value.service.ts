import { Injectable } from '@nestjs/common';
import { MatsDerivedHourlyValueMap } from '../maps/mats-derived-hourly-value.map';
import { MatsDerivedHourlyValueRepository } from './mats-derived-hourly-value.repository';

@Injectable()
export class MatsDerivedHourlyValueService {
  constructor(
    private readonly map: MatsDerivedHourlyValueMap,
    private readonly repository: MatsDerivedHourlyValueRepository,
  ) {}

  async export(hourIds: string[]) {
    const matsDerivedHourlyValueData = await this.repository.export(hourIds);
    return this.map.many(matsDerivedHourlyValueData);
  }
}
