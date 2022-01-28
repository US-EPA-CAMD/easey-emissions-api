import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';

import { HourUnitData } from '../entities/hour-unit-data.entity';
import { ApportionedEmissionsMap } from './apportioned-emissions.map';
import { HourlyApportionedEmissionsDTO } from '../dto/hourly-apportioned-emissions.dto';

@Injectable()
export class HourlyApportionedEmissionsMap extends BaseMap<HourUnitData, HourlyApportionedEmissionsDTO> {
  constructor(private readonly apportionedEmissionsMap: ApportionedEmissionsMap) { super(); }

  public async one(entity: HourUnitData): Promise<HourlyApportionedEmissionsDTO> {
    return {
      ...await this.apportionedEmissionsMap.one(entity),
      date: entity.date.toISOString().split('T')[0],
      hour: Number(entity.hour),
      opTime: entity.opTime
        ? Number(entity.opTime)
        : entity.opTime,
    };
  }
}
