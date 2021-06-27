import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApportionedEmissionsController } from './apportioned-emissions.controller';
import { ApportionedEmissionsService } from './apportioned-emissions.service';
import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourlyApportionedEmissionsMap } from '../maps/hourly-apportioned-emissions.map';
import { DayUnitDataRepository } from './day-unit-data.repository';
import { DailyApportionedEmissionsMap } from '../maps/daily-apportioned-emissions.map';
import { MonthUnitDataRepository } from './month-unit-data.repository';
import { MonthlyApportionedEmissionsMap } from '../maps/monthly-apportioned-emissions.map';
import { QuarterlyApportionedEmissionsMap } from '../maps/quarterly-apportioned-emissions.map';
import { QuarterUnitDataRepository } from './quarter-unit-data.repository';
import { AnnualApportionedEmissionsMap } from '../maps/annual-apportioned-emissions.map';
import { AnnualUnitDataRepository } from './annual-unit-data.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HourUnitDataRepository,
      DayUnitDataRepository,
      MonthUnitDataRepository,
      QuarterUnitDataRepository,
      AnnualUnitDataRepository,
    ]),
  ],
  controllers: [ApportionedEmissionsController],
  providers: [
    ApportionedEmissionsService,
    HourlyApportionedEmissionsMap,
    DailyApportionedEmissionsMap,
    MonthlyApportionedEmissionsMap,
    QuarterlyApportionedEmissionsMap,
    AnnualApportionedEmissionsMap,
  ],
})
export class ApportionedEmissionsModule {}
