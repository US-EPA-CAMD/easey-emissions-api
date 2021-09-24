import { Injectable } from '@nestjs/common';

import { ApportionedEmissionsMap } from './apportioned-emissions.map';
import { ApportionedEmissionsDTO } from '../dto/apportioned-emissions.dto';
import { HourlyApportionedEmissionsDTO } from '../dto/hourly-apportioned-emissions.dto';
import { HourUnitData } from '../entities/hour-unit-data.entity';

@Injectable()
export class HourlyApportionedEmissionsMap extends ApportionedEmissionsMap {
  public async one(
    entity: HourUnitData,
  ): Promise<HourlyApportionedEmissionsDTO> {
    const apportionedEmissionsDto: ApportionedEmissionsDTO = await super.one(
      entity,
    );
    return {
      ...apportionedEmissionsDto,
      opDate: entity.opDate.toISOString().split('T')[0],
      opHour: Number(entity.opHour),
      opTime: entity.opTime ? Number(entity.opTime) : entity.opTime,
      so2MassMeasureFlg: entity.so2MassMeasureFlg,
      so2RateMeasureFlg: entity.so2RateMeasureFlg,
      noxMassMeasureFlg: entity.noxMassMeasureFlg,
      noxRateMeasureFlg: entity.noxRateMeasureFlg,
      co2MassMeasureFlg: entity.co2MassMeasureFlg,
      co2RateMeasureFlg: entity.co2RateMeasureFlg,
    };
  }
}
