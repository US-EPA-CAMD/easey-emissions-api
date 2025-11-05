import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { withSlaveConnection } from '@us-epa-camd/easey-common';

import { DerivedHourlyValueRepository } from './derived-hourly-value.repository';
import { DerivedHourlyValueMap } from '../maps/derived-hourly-value.map';

@Injectable()
export class DerivedHourlyValueService {

  constructor(
    private readonly dataSource: DataSource,
    private readonly repository: DerivedHourlyValueRepository,
    private readonly map: DerivedHourlyValueMap,
  ) {}

  async export(rptPeriodId: number, monLocIds: string[]) {
    return withSlaveConnection(this.dataSource, async () => {
      const derivedHourlyValueData = await this.repository.export(rptPeriodId, monLocIds);
      return this.map.many(derivedHourlyValueData);
    });
  }
}
