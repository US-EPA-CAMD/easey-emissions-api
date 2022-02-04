import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { UnitAttributesMap } from '../../maps/unit-atributes.map';
import { UnitFacilityIdentificationMap } from '../../maps/unit-facility-identification.map';
import { HourlyApportionedEmissionsMap } from '../../maps/hourly-apportioned-emissions.map';

import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourlyApportionedEmissionsService } from './hourly-apportioned-emissions.service';
import { HourlyApportionedEmissionsController } from './hourly-apportioned-emissions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HourUnitDataRepository,
    ]),
    HttpModule,
  ],
  controllers: [
    HourlyApportionedEmissionsController
  ],
  providers: [
    ConfigService,
    UnitAttributesMap,
    UnitFacilityIdentificationMap,
    HourlyApportionedEmissionsMap,
    HourlyApportionedEmissionsService,
  ],
  exports: [
    TypeOrmModule,
    HourlyApportionedEmissionsMap
  ],
})
export class HourlyApportionedEmissionsModule {}
