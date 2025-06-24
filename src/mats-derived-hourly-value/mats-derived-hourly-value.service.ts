import { Injectable } from '@nestjs/common';

import { MatsDerivedHourlyValueDTO } from '../dto/mats-derived-hourly-value.dto';
import { MatsDerivedHourlyValueMap } from '../maps/mats-derived-hourly-value.map';
import { MatsDerivedHourlyValueRepository } from './mats-derived-hourly-value.repository';

@Injectable()
export class MatsDerivedHourlyValueService {

  constructor(
    private readonly map: MatsDerivedHourlyValueMap,
    private readonly repository: MatsDerivedHourlyValueRepository,
  ) {}

  async export(rptPeriodId: number, monLocIds: string[]): Promise<MatsDerivedHourlyValueDTO[]> {
    const matsDerivedHourlyValueData = await this.repository.export(rptPeriodId, monLocIds);
    return this.map.many(matsDerivedHourlyValueData);
  }
}
