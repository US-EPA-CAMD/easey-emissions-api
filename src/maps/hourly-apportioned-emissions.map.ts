import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

import { BaseMap } from './base.map';
import { HourlyApportionedEmissionsDTO } from '../dto/hourly-apportioned-emissions.dto';
import { HourUnitData } from '../entities/hour-unit-data.entity';

@Injectable()
export class HourlyApportionedEmissionsMap extends BaseMap<
  HourUnitData,
  HourlyApportionedEmissionsDTO
> {
  public async one(
    entity: HourUnitData,
  ): Promise<HourlyApportionedEmissionsDTO> {
    return {
      state: entity.unitFact.state,
      facilityName: entity.unitFact.facilityName,
      orisCode: entity.unitFact.orisCode,
      unitId: entity.unitFact.unitid,
      opDate: moment(entity.opDate).format('L'),
      opHour: entity.opHour,
      opTime: entity.opTime,
      gLoad: entity.gload,
      sLoad: entity.sload,
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
      primaryFuelInfo: entity.unitFact.primaryFuelInfo,
      secondaryFuelInfo: entity.unitFact.secondaryFuelInfo,
      unitTypeInfo: entity.unitFact.unitTypeInfo,
      so2ControlInfo: entity.unitFact.so2ControlInfo,
      partControlInfo: entity.unitFact.partControlInfo,
      noxControlInfo: entity.unitFact.noxControlInfo,
      hgControlInfo: entity.unitFact.hgControlInfo,
    };
  }
}
