import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';

import { UnitFactMap } from './unit-fact.map';
import { HourUnitData } from './../entities/hour-unit-data.entity';
import { DayUnitData } from './../entities/day-unit-data.entity';
import { MonthUnitData } from './../entities/month-unit-data.entity';
import { QuarterUnitData } from './../entities/quarter-unit-data.entity';
import { AnnualUnitData } from './../entities/annual-unit-data.entity';
import { OzoneUnitData } from './../entities/ozone-unit-data.entity';
import { ApportionedEmissionsDTO } from '../dto/apportioned-emissions.dto';

@Injectable()
export class ApportionedEmissionsMap extends BaseMap<
  HourUnitData | DayUnitData | MonthUnitData | QuarterUnitData | AnnualUnitData | OzoneUnitData,
  ApportionedEmissionsDTO
> {
  constructor(private readonly unitFactMap: UnitFactMap) { super(); }

  public async one(
    entity: HourUnitData | DayUnitData | MonthUnitData | QuarterUnitData | AnnualUnitData | OzoneUnitData
  ): Promise<ApportionedEmissionsDTO> {
    return {
      ...await this.unitFactMap.one(entity.unitFact),
      grossLoad: entity.grossLoad
        ? Number(entity.grossLoad)
        : entity.grossLoad,
      steamLoad: entity.steamLoad
        ? Number(entity.steamLoad)
        : entity.steamLoad,
      so2Mass: entity.so2Mass
        ? Number(entity.so2Mass)
        : entity.so2Mass,
      so2Rate: entity.so2Rate
        ? Number(entity.so2Rate)
        : entity.so2Rate,
      noxMass: entity.noxMass
        ? Number(entity.noxMass)
        : entity.noxMass,
      noxRate: entity.noxRate
        ? Number(entity.noxRate)
        : entity.noxRate,
      co2Mass: entity.co2Mass
        ? Number(entity.co2Mass)
        : entity.co2Mass,
      co2Rate: entity.co2Rate
        ? Number(entity.co2Rate)
        : entity.co2Rate,
      heatInput: entity.heatInput
        ? Number(entity.heatInput)
        : entity.heatInput,
    };
  }
}
