import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';

import { AnnualUnitData } from '../entities/annual-unit-data.entity';
import { ApportionedEmissionsMap } from './apportioned-emissions.map';
import { AnnualApportionedEmissionsDTO } from '../dto/annual-apportioned-emissions.dto';

@Injectable()
export class AnnualApportionedEmissionsMap extends BaseMap<AnnualUnitData, AnnualApportionedEmissionsDTO> {
  constructor(private readonly apportionedEmissionsMap: ApportionedEmissionsMap) { super(); }

  public async one(entity: AnnualUnitData): Promise<AnnualApportionedEmissionsDTO> {
    return {
      ...await this.apportionedEmissionsMap.one(entity),
      year: Number(entity.year),
      sumOpTime: entity.sumOpTime
        ? Number(entity.sumOpTime)
        : entity.sumOpTime,
      countOpTime: entity.countOpTime
        ? Number(entity.countOpTime)
        : entity.countOpTime,
    };
  }
}
