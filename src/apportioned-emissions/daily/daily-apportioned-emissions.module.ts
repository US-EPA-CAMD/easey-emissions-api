import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { UnitAttributesMap } from '../../maps/unit-atributes.map';
import { ApportionedEmissionsMap } from '../../maps/apportioned-emissions.map';
import { DailyApportionedEmissionsMap } from '../../maps/daily-apportioned-emissions.map';
import { UnitFacilityIdentificationMap } from '../../maps/unit-facility-identification.map';

import { DayUnitDataRepository } from './day-unit-data.repository';
import { DailyApportionedEmissionsService } from './daily-apportioned-emissions.service';
import { DailyApportionedEmissionsController } from './daily-apportioned-emissions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DayUnitDataRepository,
    ]),
    HttpModule,
  ],
  controllers: [
    DailyApportionedEmissionsController
  ],
  providers: [
    ConfigService,
    UnitAttributesMap,
    ApportionedEmissionsMap,
    UnitFacilityIdentificationMap,
    DailyApportionedEmissionsMap,
    DailyApportionedEmissionsService,
  ],
  exports: [
    TypeOrmModule,    
    DailyApportionedEmissionsMap
  ],
})
export class DailyApportionedEmissionsModule {}
