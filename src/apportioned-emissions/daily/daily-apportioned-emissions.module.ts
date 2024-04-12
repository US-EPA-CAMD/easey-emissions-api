import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DailyApportionedEmissionsController } from './daily-apportioned-emissions.controller';
import { DailyApportionedEmissionsService } from './daily-apportioned-emissions.service';
import { DayUnitDataRepository } from './day-unit-data.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DayUnitDataRepository])],
  controllers: [DailyApportionedEmissionsController],
  providers: [
    ConfigService,
    DayUnitDataRepository,
    DailyApportionedEmissionsService,
  ],
  exports: [TypeOrmModule],
})
export class DailyApportionedEmissionsModule {}
