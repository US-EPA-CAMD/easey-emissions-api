import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

// import { UnitAttributesMap } from '../../maps/unit-atributes.map';
// import { ApportionedEmissionsMap } from '../../maps/apportioned-emissions.map';
// import { MonthlyApportionedEmissionsMap } from '../../maps/monthly-apportioned-emissions.map';
// import { UnitFacilityIdentificationMap } from '../../maps/unit-facility-identification.map';

import { MonthUnitDataRepository } from './month-unit-data.repository';
import { MonthlyApportionedEmissionsService } from './monthly-apportioned-emissions.service';
import { MonthlyApportionedEmissionsController } from './monthly-apportioned-emissions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MonthUnitDataRepository,
    ]),
    HttpModule,
  ],
  controllers: [
    MonthlyApportionedEmissionsController
  ],
  providers: [
    ConfigService,
    // UnitAttributesMap,
    // ApportionedEmissionsMap,
    // UnitFacilityIdentificationMap,
    // MonthlyApportionedEmissionsMap,
    MonthlyApportionedEmissionsService,
  ],
  exports: [
    TypeOrmModule,    
    //MonthlyApportionedEmissionsMap
  ],
})
export class MonthlyApportionedEmissionsModule {}
