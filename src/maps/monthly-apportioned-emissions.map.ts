import { Injectable } from '@nestjs/common';

import { ApportionedEmissionsMap } from './apportioned-emissions.map';
import { ApportionedEmissionsDTO } from '../dto/apportioned-emissions.dto';
import { MonthUnitData } from '../entities/month-unit-data.entity';
import { MonthlyApportionedEmissionsDTO } from '../dto/monthly-apportioned-emissions.dto';

@Injectable()
export class MonthlyApportionedEmissionsMap extends ApportionedEmissionsMap {
  public async one(
    entity: MonthUnitData,
  ): Promise<MonthlyApportionedEmissionsDTO> {
    const apportionedEmissionsDto: ApportionedEmissionsDTO = await super.one(
      entity,
    );

    return {
      ...apportionedEmissionsDto,
      opYear: entity.opYear,
      opMonth: entity.opMonth,
      sumOpTime: entity.sumOpTime,
      countOpTime: entity.countOpTime,
    };
  }
}
