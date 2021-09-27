import { Injectable } from '@nestjs/common';

import { ApportionedEmissionsMap } from './apportioned-emissions.map';
import { ApportionedEmissionsDTO } from '../dto/apportioned-emissions.dto';
import { AnnualUnitData } from '../entities/annual-unit-data.entity';
import { AnnualApportionedEmissionsDTO } from '../dto/annual-apportioned-emissions.dto';

@Injectable()
export class AnnualApportionedEmissionsMap extends ApportionedEmissionsMap {
  public async one(
    entity: AnnualUnitData,
  ): Promise<AnnualApportionedEmissionsDTO> {
    const apportionedEmissionsDto: ApportionedEmissionsDTO = await super.one(
      entity,
    );
    return {
      ...apportionedEmissionsDto,
      opYear: Number(entity.opYear),
      sumOpTime: entity.sumOpTime ? Number(entity.sumOpTime) : entity.sumOpTime,
      countOpTime: entity.countOpTime
        ? Number(entity.countOpTime)
        : entity.countOpTime,
    };
  }
}
