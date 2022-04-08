import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { DayUnitDataRepository } from './day-unit-data.repository';
import { DailyApportionedEmissionsService } from './daily-apportioned-emissions.service';
import { DailyApportionedEmissionsController } from './daily-apportioned-emissions.controller';
import { StreamModule } from '@us-epa-camd/easey-common/stream';

@Module({
  imports: [
    TypeOrmModule.forFeature([DayUnitDataRepository]),
    HttpModule,
    StreamModule,
  ],
  controllers: [DailyApportionedEmissionsController],
  providers: [ConfigService, DailyApportionedEmissionsService],
  exports: [TypeOrmModule],
})
export class DailyApportionedEmissionsModule {}
