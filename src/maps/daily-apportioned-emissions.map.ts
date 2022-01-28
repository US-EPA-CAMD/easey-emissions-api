import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';

import { DayUnitData } from '../entities/day-unit-data.entity';
import { ApportionedEmissionsMap } from './apportioned-emissions.map';
import { DailyApportionedEmissionsDTO } from '../dto/daily-apportioned-emissions.dto';

@Injectable()
export class DailyApportionedEmissionsMap extends BaseMap<DayUnitData, DailyApportionedEmissionsDTO> {
  constructor(private readonly apportionedEmissionsMap: ApportionedEmissionsMap) { super(); }

  public async one(entity: DayUnitData): Promise<DailyApportionedEmissionsDTO> {
    return {
      ...await this.apportionedEmissionsMap.one(entity),
      date: entity.date.toISOString().split('T')[0],
      sumOpTime: entity.sumOpTime
        ? Number(entity.sumOpTime)
        : entity.sumOpTime,
      countOpTime: entity.countOpTime
        ? Number(entity.countOpTime)
        : entity.countOpTime,
    };
  }
}
