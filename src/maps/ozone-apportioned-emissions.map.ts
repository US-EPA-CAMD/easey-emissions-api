import { Injectable } from '@nestjs/common';

import { ApportionedEmissionsMap } from './apportioned-emissions.map';
import { ApportionedEmissionsDTO } from '../dto/apportioned-emissions.dto';
import { OzoneUnitData } from '../entities/ozone-unit-data.entity';
import { OzoneApportionedEmissionsDTO } from '../dto/ozone-apporitoned-emissions.dto';

@Injectable()
export class OzoneApportionedEmissionsMap extends ApportionedEmissionsMap {
  public async one(
    entity: OzoneUnitData,
  ): Promise<OzoneApportionedEmissionsDTO> {
    const apportionedEmissionsDto: ApportionedEmissionsDTO = await super.one(
      entity,
    );

    return {
      ...apportionedEmissionsDto,
      opYear: entity.opYear,
      sumOpTime: entity.sumOpTime,
      countOpTime: entity.countOpTime,
    };
  }
}
