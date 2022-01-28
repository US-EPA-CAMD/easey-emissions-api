import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';

import { MonthUnitData } from '../entities/month-unit-data.entity';
import { ApportionedEmissionsMap } from './apportioned-emissions.map';
import { MonthlyApportionedEmissionsDTO } from '../dto/monthly-apportioned-emissions.dto';

@Injectable()
export class MonthlyApportionedEmissionsMap extends BaseMap<MonthUnitData, MonthlyApportionedEmissionsDTO> {
  constructor(private readonly apportionedEmissionsMap: ApportionedEmissionsMap) { super(); }

  public async one(entity: MonthUnitData): Promise<MonthlyApportionedEmissionsDTO> {
    return {
      ...await this.apportionedEmissionsMap.one(entity),
      year: Number(entity.year),
      month: Number(entity.month),
      sumOpTime: entity.sumOpTime
        ? Number(entity.sumOpTime)
        : entity.sumOpTime,
      countOpTime: entity.countOpTime
        ? Number(entity.countOpTime)
        : entity.countOpTime,
    };
  }
}
