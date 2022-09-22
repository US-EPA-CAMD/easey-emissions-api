import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DailyTestSummaryModule } from '../daily-test-summary/daily-test-summary.module';

import { EmissionsController } from './emissions.controller';
import { EmissionsService } from './emissions.service';
import { EmissionsRepository } from './emissions.repository';
import { EmissionsSubmissionsProgressRepository } from './emissions-submissions-progress.repository';

import { EmissionsMap } from '../maps/emissions.map';
import { EmissionsSubmissionsProgressMap } from '../maps/emissions-submissions-progress.map';
import { HourlyOperatingModule } from '../hourly-operating/hourly-operating.module';
import { HourlyParameterFuelFlowModule } from '../hourly-parameter-fuel-flow/hourly-parameter-fuel-flow.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EmissionsRepository,
      EmissionsSubmissionsProgressRepository,
    ]),
    DailyTestSummaryModule,
    HourlyOperatingModule,
    HourlyParameterFuelFlowModule,
  ],
  controllers: [EmissionsController],
  providers: [EmissionsMap, EmissionsService, EmissionsSubmissionsProgressMap],
})
export class EmissionsModule {}
