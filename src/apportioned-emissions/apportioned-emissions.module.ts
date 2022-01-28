import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { UnitFactMap } from '../maps/unit-fact.map';
import { ApportionedEmissionsMap } from './../maps/apportioned-emissions.map';
import { ApportionedEmissionsController } from './apportioned-emissions.controller';
import { ApportionedEmissionsService } from './apportioned-emissions.service';
import { HourlyApportionedEmissionsMap } from '../maps/hourly-apportioned-emissions.map';
import { DayUnitDataRepository } from './day-unit-data.repository';
import { DailyApportionedEmissionsMap } from '../maps/daily-apportioned-emissions.map';
import { MonthUnitDataRepository } from './month-unit-data.repository';
import { MonthlyApportionedEmissionsMap } from '../maps/monthly-apportioned-emissions.map';
import { QuarterUnitDataRepository } from './quarter-unit-data.repository';
import { QuarterlyApportionedEmissionsMap } from '../maps/quarterly-apportioned-emissions.map';
import { AnnualUnitDataRepository } from './annual-unit-data.repository';
import { AnnualApportionedEmissionsMap } from '../maps/annual-apportioned-emissions.map';
import { OzoneUnitDataRepository } from './ozone-unit-data.repository';
import { OzoneApportionedEmissionsMap } from '../maps/ozone-apportioned-emissions.map';

import { HourlyApportionedEmissionsModule } from 'src/hourly-apportioned-emissions/hourly-apportioned-emissions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DayUnitDataRepository,
      MonthUnitDataRepository,
      QuarterUnitDataRepository,
      AnnualUnitDataRepository,
      OzoneUnitDataRepository,
    ]),
    HttpModule,
    HourlyApportionedEmissionsModule,
  ],
  controllers: [ApportionedEmissionsController],
  providers: [
    UnitFactMap,
    ApportionedEmissionsMap,
    ApportionedEmissionsService,
    DailyApportionedEmissionsMap,
    MonthlyApportionedEmissionsMap,
    QuarterlyApportionedEmissionsMap,
    AnnualApportionedEmissionsMap,
    OzoneApportionedEmissionsMap,
    ConfigService,
  ],
})
export class ApportionedEmissionsModule {}
