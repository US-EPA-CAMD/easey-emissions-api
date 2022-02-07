// import { Injectable } from '@nestjs/common';
// import { BaseMap } from '@us-epa-camd/easey-common/maps';

// import { DayUnitData } from './../entities/day-unit-data.entity';
// import { MonthUnitData } from './../entities/month-unit-data.entity';
// import { QuarterUnitData } from './../entities/quarter-unit-data.entity';
// import { AnnualUnitData } from './../entities/annual-unit-data.entity';
// import { OzoneUnitData } from './../entities/ozone-unit-data.entity';

// @Injectable()
// export class ApportionedEmissionsMap extends BaseMap<
//   DayUnitData | MonthUnitData | QuarterUnitData | AnnualUnitData | OzoneUnitData, any
// > {
//   public async one(
//     entity: DayUnitData | MonthUnitData | QuarterUnitData | AnnualUnitData | OzoneUnitData
//   ): Promise<any> {
//     return {
//       sumOpTime: entity.sumOpTime,
//       countOpTime: entity.countOpTime,     
//       grossLoad: entity.grossLoad,
//       steamLoad: entity.steamLoad,
//       so2Mass: entity.so2Mass,
//       so2Rate: entity.so2Rate,
//       noxMass: entity.noxMass,
//       noxRate: entity.noxRate,
//       co2Mass: entity.co2Mass,
//       co2Rate: entity.co2Rate,
//       heatInput: entity.heatInput,
//     };
//   }
// }
