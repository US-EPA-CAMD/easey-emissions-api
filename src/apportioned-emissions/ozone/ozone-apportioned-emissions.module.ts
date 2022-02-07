import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

// import { UnitAttributesMap } from '../../maps/unit-atributes.map';
// import { ApportionedEmissionsMap } from '../../maps/apportioned-emissions.map';
// import { OzoneApportionedEmissionsMap } from '../../maps/ozone-apportioned-emissions.map';
// import { AnnualApportionedEmissionsMap } from '../../maps/annual-apportioned-emissions.map';
// import { UnitFacilityIdentificationMap } from '../../maps/unit-facility-identification.map';

import { OzoneUnitDataRepository } from './ozone-unit-data.repository';
import { OzoneApportionedEmissionsService } from './ozone-apportioned-emissions.service';
import { OzoneApportionedEmissionsController } from './ozone-apportioned-emissions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OzoneUnitDataRepository,
    ]),
    HttpModule,
  ],
  controllers: [
    OzoneApportionedEmissionsController
  ],
  providers: [
    ConfigService,
    // UnitAttributesMap,
    // ApportionedEmissionsMap,
    // UnitFacilityIdentificationMap,
    // AnnualApportionedEmissionsMap,
    // OzoneApportionedEmissionsMap,
    OzoneApportionedEmissionsService,
  ],
  exports: [
    TypeOrmModule,    
    //OzoneApportionedEmissionsMap
  ],
})
export class OzoneApportionedEmissionsModule {}
