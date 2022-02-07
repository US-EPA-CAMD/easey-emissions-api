// import { Injectable } from '@nestjs/common';
// import { BaseMap } from '@us-epa-camd/easey-common/maps';

// import { QuarterUnitData } from '../entities/quarter-unit-data.entity';
// import { QuarterlyApportionedEmissionsDTO } from '../dto/quarterly-apportioned-emissions.dto';

// import { UnitAttributesMap } from './unit-atributes.map';
// import { ApportionedEmissionsMap } from './apportioned-emissions.map';
// import { UnitFacilityIdentificationMap } from './unit-facility-identification.map';

// @Injectable()
// export class QuarterlyApportionedEmissionsMap extends BaseMap<QuarterUnitData, QuarterlyApportionedEmissionsDTO> {
//   constructor(
//     private readonly unitAttributesMap: UnitAttributesMap,
//     private readonly unitFacilityIdMap: UnitFacilityIdentificationMap,
//     private readonly apportionedEmissionsMap: ApportionedEmissionsMap,
//   ) {
//     super();
//   }

//   public async one(entity: QuarterUnitData): Promise<QuarterlyApportionedEmissionsDTO> {
//     return {
//       ...await this.unitFacilityIdMap.one(entity.unitFact),
//       year: entity.year,
//       quarter: entity.quarter,
//       ...await this.apportionedEmissionsMap.one(entity),
//       ...await this.unitAttributesMap.one(entity.unitFact),
//     };
//   }
// }
