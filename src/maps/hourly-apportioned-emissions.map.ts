import { Injectable } from '@nestjs/common';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

import { ApportionedEmissionsMap } from './apportioned-emissions.map';
import { ApportionedEmissionsDTO } from '../dto/apportioned-emissions.dto';
import { HourUnitData } from '../entities/hour-unit-data.entity';

@Injectable()
export class HourlyApportionedEmissionsMap extends ApportionedEmissionsMap {
  public async one(entity: HourUnitData): Promise<any> {
    const apportionedEmissionsDto: ApportionedEmissionsDTO = await super.one(
      entity,
    );
    return {
      ...apportionedEmissionsDto,
      [propertyMetadata.date.fieldLabels
        .value]: entity.date.toISOString().split('T')[0],
      [propertyMetadata.hour.fieldLabels.value]: Number(entity.hour),
      [propertyMetadata.opTime.fieldLabels.value]: entity.opTime
        ? Number(entity.opTime)
        : entity.opTime,
      [propertyMetadata.so2MassMeasureFlg.fieldLabels.value]:
        entity.so2MassMeasureFlg,
      [propertyMetadata.so2RateMeasureFlg.fieldLabels.value]:
        entity.so2RateMeasureFlg,
      [propertyMetadata.noxMassMeasureFlg.fieldLabels.value]:
        entity.noxMassMeasureFlg,
      [propertyMetadata.noxRateMeasureFlg.fieldLabels.value]:
        entity.noxRateMeasureFlg,
      [propertyMetadata.co2MassMeasureFlg.fieldLabels.value]:
        entity.co2MassMeasureFlg,
      [propertyMetadata.co2RateMeasureFlg.fieldLabels.value]:
        entity.co2RateMeasureFlg,
    };
  }
}
