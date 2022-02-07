import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

// import { UnitAttributesMap } from '../../maps/unit-atributes.map';
// import { ApportionedEmissionsMap } from '../../maps/apportioned-emissions.map';
// import { QuarterlyApportionedEmissionsMap } from '../../maps/quarterly-apportioned-emissions.map';
// import { UnitFacilityIdentificationMap } from '../../maps/unit-facility-identification.map';

import { QuarterUnitDataRepository } from './quarter-unit-data.repository';
import { QuarterlyApportionedEmissionsService } from './quarterly-apportioned-emissions.service';
import { QuarterlyApportionedEmissionsController } from './quarterly-apportioned-emissions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuarterUnitDataRepository,
    ]),
    HttpModule,
  ],
  controllers: [
    QuarterlyApportionedEmissionsController
  ],
  providers: [
    ConfigService,
    // UnitAttributesMap,
    // ApportionedEmissionsMap,
    // UnitFacilityIdentificationMap,
    // QuarterlyApportionedEmissionsMap,
    QuarterlyApportionedEmissionsService,
  ],
  exports: [
    TypeOrmModule,    
    //QuarterlyApportionedEmissionsMap
  ],
})
export class QuarterlyApportionedEmissionsModule {}
