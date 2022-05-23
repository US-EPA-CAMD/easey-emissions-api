import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { StreamingService } from './../../streaming/streaming.service';
import { DayUnitDataRepository } from './day-unit-data.repository';
import { DailyApportionedEmissionsService } from './daily-apportioned-emissions.service';
import { DailyApportionedEmissionsController } from './daily-apportioned-emissions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([DayUnitDataRepository]),
  ],
  controllers: [DailyApportionedEmissionsController],
  providers: [
    ConfigService,
    StreamingService,
    DailyApportionedEmissionsService
  ],
  exports: [TypeOrmModule],
})
export class DailyApportionedEmissionsModule {}
