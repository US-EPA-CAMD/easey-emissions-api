import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DailyTestSummaryModule } from '../daily-test-summary/daily-test-summary.module';

import { EmissionsController } from './emissions.controller';
import { EmissionsService } from './emissions.service';
import { EmissionsRepository } from './emissions.repository';
import { EmissionsSubmissionsProgressRepository } from './emissions-submissions-progress.repository';

import { EmissionsMap } from '../maps/emissions.map';
import { EmissionsSubmissionsProgressMap } from '../maps/emissions-submissions-progress.map';
import { HourlyOperatingDataService } from '../hourly-operating-data/hourly-operating-data.service';
import { HourlyOperatingDataRepository } from '../hourly-operating-data/hourly-operating-data.repository';
import { DerivedHourlyValueService } from '../derived-hourly-value/derived-hourly-value.service';
import { DerivedHourlyValueRepository } from '../derived-hourly-value/derived-hourly-value.repository';
import { DerivedHourlyValueMap } from '../derived-hourly-value/derived-hourly-value.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HourlyOperatingDataRepository,
      DerivedHourlyValueRepository,
      EmissionsRepository,
      EmissionsSubmissionsProgressRepository,
    ]),
    DailyTestSummaryModule,
  ],
  controllers: [EmissionsController],
  providers: [
    DerivedHourlyValueMap,
    DerivedHourlyValueService,
    EmissionsMap,
    EmissionsService,
    EmissionsSubmissionsProgressMap,
    HourlyOperatingDataService,
  ],
})
export class EmissionsModule {}
