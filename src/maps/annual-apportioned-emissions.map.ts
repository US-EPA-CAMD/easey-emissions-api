import { Injectable } from '@nestjs/common';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

import { ApportionedEmissionsMap } from './apportioned-emissions.map';
import { ApportionedEmissionsDTO } from '../dto/apportioned-emissions.dto';
import { AnnualUnitData } from '../entities/annual-unit-data.entity';

@Injectable()
export class AnnualApportionedEmissionsMap extends ApportionedEmissionsMap {
  public async one(entity: AnnualUnitData): Promise<any> {
    const apportionedEmissionsDto: ApportionedEmissionsDTO = await super.one(
      entity,
    );
    return {
      ...apportionedEmissionsDto,
      [propertyMetadata.year.fieldLabels.value]: Number(entity.year),
      [propertyMetadata.sumOpTime.fieldLabels.value]: entity.sumOpTime
        ? Number(entity.sumOpTime)
        : entity.sumOpTime,
      [propertyMetadata.countOpTime.fieldLabels.value]: entity.countOpTime
        ? Number(entity.countOpTime)
        : entity.countOpTime,
    };
  }
}
