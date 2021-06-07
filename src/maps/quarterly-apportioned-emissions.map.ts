import { Injectable } from '@nestjs/common';

import { ApportionedEmissionsMap } from './apportioned-emissions.map';
import { ApportionedEmissionsDTO } from '../dto/apportioned-emissions.dto';
import { QuarterUnitData } from '../entities/quarter-unit-data.entity';
import { QuarterlyApportionedEmissionsDTO } from '../dto/quarterly-apportioned-emissions.dto';

@Injectable()
export class QuarterlyApportionedEmissionsMap extends ApportionedEmissionsMap {
  public async one(
    entity: QuarterUnitData,
  ): Promise<QuarterlyApportionedEmissionsDTO> {
    const apportionedEmissionsDto: ApportionedEmissionsDTO = await super.one(
      entity,
    );

    return {
      ...apportionedEmissionsDto,
      opYear: entity.opYear,
      opQuarter: entity.opQuarter,
      sumOpTime: entity.sumOpTime,
      countOpTime: entity.countOpTime,
    };
  }
}
