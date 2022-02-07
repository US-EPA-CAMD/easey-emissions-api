import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

// import { UnitAttributesMap } from '../../maps/unit-atributes.map';
// import { ApportionedEmissionsMap } from '../../maps/apportioned-emissions.map';
// import { AnnualApportionedEmissionsMap } from '../../maps/annual-apportioned-emissions.map';
// import { UnitFacilityIdentificationMap } from '../../maps/unit-facility-identification.map';

import { AnnualUnitDataRepository } from './annual-unit-data.repository';
import { AnnualApportionedEmissionsService } from './annual-apportioned-emissions.service';
import { AnnualApportionedEmissionsController } from './annual-apportioned-emissions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AnnualUnitDataRepository,
    ]),
    HttpModule,
  ],
  controllers: [
    AnnualApportionedEmissionsController
  ],
  providers: [
    ConfigService,
    // UnitAttributesMap,
    // ApportionedEmissionsMap,
    // UnitFacilityIdentificationMap,
    // AnnualApportionedEmissionsMap,
    AnnualApportionedEmissionsService,
  ],
  exports: [
    TypeOrmModule,    
    //AnnualApportionedEmissionsMap
  ],
})
export class AnnualApportionedEmissionsModule {}
