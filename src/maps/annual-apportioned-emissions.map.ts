import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';

import { AnnualUnitData } from '../entities/annual-unit-data.entity';
import { AnnualApportionedEmissionsDTO } from '../dto/annual-apportioned-emissions.dto';

import { UnitAttributesMap } from './unit-atributes.map';
import { ApportionedEmissionsMap } from './apportioned-emissions.map';
import { UnitFacilityIdentificationMap } from './unit-facility-identification.map';

@Injectable()
export class AnnualApportionedEmissionsMap extends BaseMap<AnnualUnitData, AnnualApportionedEmissionsDTO> {
  constructor(
    private readonly unitAttributesMap: UnitAttributesMap,
    private readonly unitFacilityIdMap: UnitFacilityIdentificationMap,
    private readonly apportionedEmissionsMap: ApportionedEmissionsMap,
  ) {
    super();
  }

  public async one(entity: AnnualUnitData): Promise<AnnualApportionedEmissionsDTO> {
    return {
      ...await this.unitFacilityIdMap.one(entity.unitFact),
      year: entity.year,
      ...await this.apportionedEmissionsMap.one(entity),
      ...await this.unitAttributesMap.one(entity.unitFact),
    };
  }
}
