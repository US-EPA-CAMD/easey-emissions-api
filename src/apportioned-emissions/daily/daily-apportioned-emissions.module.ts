import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { DayUnitDataRepository } from './day-unit-data.repository';
import { DailyApportionedEmissionsService } from './daily-apportioned-emissions.service';
import { DailyApportionedEmissionsController } from './daily-apportioned-emissions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DayUnitDataRepository]), HttpModule],
  controllers: [DailyApportionedEmissionsController],
  providers: [ConfigService, DailyApportionedEmissionsService],
  exports: [TypeOrmModule],
})
export class DailyApportionedEmissionsModule {}
