import { Injectable } from '@nestjs/common';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

import { ApportionedEmissionsMap } from './apportioned-emissions.map';
import { ApportionedEmissionsDTO } from '../dto/apportioned-emissions.dto';
import { QuarterUnitData } from '../entities/quarter-unit-data.entity';

@Injectable()
export class QuarterlyApportionedEmissionsMap extends ApportionedEmissionsMap {
  public async one(entity: QuarterUnitData): Promise<any> {
    const apportionedEmissionsDto: ApportionedEmissionsDTO = await super.one(
      entity,
    );
    return {
      ...apportionedEmissionsDto,
      [propertyMetadata.year.fieldLabels.value]: Number(entity.year),
      [propertyMetadata.quarter.fieldLabels.value]: Number(entity.quarter),
      [propertyMetadata.sumOpTime.fieldLabels.value]: entity.sumOpTime
        ? Number(entity.sumOpTime)
        : entity.sumOpTime,
      [propertyMetadata.countOpTime.fieldLabels.value]: entity.countOpTime
        ? Number(entity.countOpTime)
        : entity.countOpTime,
    };
  }
}
