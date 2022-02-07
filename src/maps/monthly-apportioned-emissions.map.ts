// import { Injectable } from '@nestjs/common';
// import { BaseMap } from '@us-epa-camd/easey-common/maps';

// import { MonthUnitData } from '../entities/month-unit-data.entity';
// import { MonthlyApportionedEmissionsDTO } from '../dto/monthly-apportioned-emissions.dto';

// import { UnitAttributesMap } from './unit-atributes.map';
// import { ApportionedEmissionsMap } from './apportioned-emissions.map';
// import { UnitFacilityIdentificationMap } from './unit-facility-identification.map';

// @Injectable()
// export class MonthlyApportionedEmissionsMap extends BaseMap<MonthUnitData, MonthlyApportionedEmissionsDTO> {
//   constructor(
//     private readonly unitAttributesMap: UnitAttributesMap,
//     private readonly unitFacilityIdMap: UnitFacilityIdentificationMap,
//     private readonly apportionedEmissionsMap: ApportionedEmissionsMap,
//   ) {
//     super();
//   }

//   public async one(entity: MonthUnitData): Promise<MonthlyApportionedEmissionsDTO> {
//     return {
//       ...await this.unitFacilityIdMap.one(entity.unitFact),
//       year: entity.year,
//       month: entity.month,
//       ...await this.apportionedEmissionsMap.one(entity),
//       ...await this.unitAttributesMap.one(entity.unitFact),
//     };
//   }
// }
