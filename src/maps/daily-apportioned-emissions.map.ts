import { Injectable } from '@nestjs/common';

import { ApportionedEmissionsMap } from './apportioned-emissions.map';
import { ApportionedEmissionsDTO } from '../dto/apportioned-emissions.dto';
import { DayUnitData } from '../entities/day-unit-data.entity';
import { propertyMetadata } from '@us-epa-camd/easey-constants/lib';

@Injectable()
export class DailyApportionedEmissionsMap extends ApportionedEmissionsMap {
  public async one(entity: DayUnitData): Promise<any> {
    const apportionedEmissionsDto: ApportionedEmissionsDTO = await super.one(
      entity,
    );
    return {
      ...apportionedEmissionsDto,
      [propertyMetadata.date.fieldLabels
        .value]: entity.date.toISOString().split('T')[0],
      [propertyMetadata.sumOpTime.fieldLabels.value]: entity.sumOpTime
        ? Number(entity.sumOpTime)
        : entity.sumOpTime,
      [propertyMetadata.countOpTime.fieldLabels.value]: entity.countOpTime
        ? Number(entity.countOpTime)
        : entity.countOpTime,
    };
  }
}
