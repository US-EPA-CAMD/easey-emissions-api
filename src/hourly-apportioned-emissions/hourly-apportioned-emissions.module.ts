import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { UnitFactMap } from '../maps/unit-fact.map';
import { HourUnitDataRepository } from './hour-unit-data.repository';
import { ApportionedEmissionsMap } from '../maps/apportioned-emissions.map';
import { HourlyApportionedEmissionsMap } from '../maps/hourly-apportioned-emissions.map';
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
    UnitFactMap,
    ConfigService,
    ApportionedEmissionsMap,    
    HourlyApportionedEmissionsMap,
    HourlyApportionedEmissionsService,
  ],
  exports: [
    TypeOrmModule,    
    HourlyApportionedEmissionsMap
  ],
})
export class HourlyApportionedEmissionsModule {}
