import { Injectable } from '@nestjs/common';

import { ApportionedEmissionsMap } from './apportioned-emissions.map';
import { ApportionedEmissionsDTO } from '../dto/apportioned-emissions.dto';
import { DayUnitData } from '../entities/day-unit-data.entity';
import { DailyApportionedEmissionsDTO } from '../dto/daily-apportioned-emissions.dto';

@Injectable()
export class DailyApportionedEmissionsMap extends ApportionedEmissionsMap {
  public async one(entity: DayUnitData): Promise<DailyApportionedEmissionsDTO> {
    const apportionedEmissionsDto: ApportionedEmissionsDTO = await super.one(
      entity,
    );

    return {
      ...apportionedEmissionsDto,
      opDate: entity.opDate.toISOString().split('T')[0],
      sumOpTime: entity.sumOpTime,
      countOpTime: entity.countOpTime,
    };
  }
}
