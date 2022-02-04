import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';

import { HourUnitData } from '../entities/hour-unit-data.entity';
import { HourlyApportionedEmissionsDTO } from '../dto/hourly-apportioned-emissions.dto';

import { UnitAttributesMap } from './unit-atributes.map';
import { UnitFacilityIdentificationMap } from './unit-facility-identification.map';

@Injectable()
export class HourlyApportionedEmissionsMap extends BaseMap<HourUnitData, HourlyApportionedEmissionsDTO> {
  constructor(
    private readonly unitAttributesMap: UnitAttributesMap,
    private readonly unitFacilityIdMap: UnitFacilityIdentificationMap,
  ) {
    super();
  }

  public async one(entity: HourUnitData): Promise<HourlyApportionedEmissionsDTO> {
    return {
      ...await this.unitFacilityIdMap.one(entity.unitFact),
      date: entity.date,
      hour: entity.hour,
      opTime: entity.opTime,
      grossLoad: entity.grossLoad,
      steamLoad: entity.steamLoad,
      so2Mass: entity.so2Mass,
      so2MassMeasureFlg: entity.so2MassMeasureFlg,
      so2Rate: entity.so2Rate,
      so2RateMeasureFlg: entity.so2RateMeasureFlg,
      noxMass: entity.noxMass,
      noxMassMeasureFlg: entity.noxMassMeasureFlg,
      noxRate: entity.noxRate,
      noxRateMeasureFlg: entity.noxRateMeasureFlg,
      co2Mass: entity.co2Mass,
      co2MassMeasureFlg: entity.co2MassMeasureFlg,
      co2Rate: entity.co2Rate,
      co2RateMeasureFlg: entity.co2RateMeasureFlg,
      heatInput: entity.heatInput,
      ...await this.unitAttributesMap.one(entity.unitFact),
    };
  }
}
