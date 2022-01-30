import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';

import { DayUnitData } from '../entities/day-unit-data.entity';
import { DailyApportionedEmissionsDTO } from '../dto/daily-apportioned-emissions.dto';

import { UnitAttributesMap } from './unit-atributes.map';
import { ApportionedEmissionsMap } from './apportioned-emissions.map';
import { UnitFacilityIdentificationMap } from './unit-facility-identification.map';

@Injectable()
export class DailyApportionedEmissionsMap extends BaseMap<DayUnitData, DailyApportionedEmissionsDTO> {
  constructor(
    private readonly unitAttributesMap: UnitAttributesMap,
    private readonly unitFacilityIdMap: UnitFacilityIdentificationMap,
    private readonly apportionedEmissionsMap: ApportionedEmissionsMap,
  ) {
    super();
  }

  public async one(entity: DayUnitData): Promise<DailyApportionedEmissionsDTO> {
    return {
      ...await this.unitFacilityIdMap.one(entity.unitFact),
      date: entity.date.toISOString().split('T')[0],
      ...await this.apportionedEmissionsMap.one(entity),
      ...await this.unitAttributesMap.one(entity.unitFact),
    };
  }
}
