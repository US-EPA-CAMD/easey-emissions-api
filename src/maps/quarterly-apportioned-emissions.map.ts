import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';

import { QuarterUnitData } from '../entities/quarter-unit-data.entity';
import { ApportionedEmissionsMap } from './apportioned-emissions.map';
import { QuarterlyApportionedEmissionsDTO } from '../dto/quarterly-apportioned-emissions.dto';

@Injectable()
export class QuarterlyApportionedEmissionsMap extends BaseMap<QuarterUnitData, QuarterlyApportionedEmissionsDTO> {
  constructor(private readonly apportionedEmissionsMap: ApportionedEmissionsMap) { super(); }

  public async one(entity: QuarterUnitData): Promise<QuarterlyApportionedEmissionsDTO> {
    return {
      ...await this.apportionedEmissionsMap.one(entity),
      year: Number(entity.year),
      quarter: Number(entity.quarter),
      sumOpTime: entity.sumOpTime
        ? Number(entity.sumOpTime)
        : entity.sumOpTime,
      countOpTime: entity.countOpTime
        ? Number(entity.countOpTime)
        : entity.countOpTime,
    };
  }
}
