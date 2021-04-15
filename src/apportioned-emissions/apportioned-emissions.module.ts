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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HourUnitDataRepository,
      DayUnitDataRepository,
      MonthUnitDataRepository,
    ]),
  ],
  controllers: [ApportionedEmissionsController],
  providers: [
    ApportionedEmissionsService,
    HourlyApportionedEmissionsMap,
    DailyApportionedEmissionsMap,
    MonthlyApportionedEmissionsMap,
  ],
})
export class ApportionedEmissionsModule {}
