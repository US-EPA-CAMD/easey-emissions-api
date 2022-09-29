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
import { DailyEmissionModule } from '../daily-emission/daily-emission.module';
import { DailyEmissionService } from '../daily-emission/daily-emission.service';
import { DailyEmissionMap } from '../maps/daily-emission.map';
import { DailyEmissionRepository } from '../daily-emission/daily-emission.repository';
import { DailyFuelService } from '../daily-fuel/daily-fuel.service';
import { DailyFuelRepository } from '../daily-fuel/daily-fuel.repository';
import { DailyFuelMap } from '../maps/daily-fuel.map';
import { SorbentTrapService } from '../sorbent-trap/sorbent-trap.service';
import { SorbentTrapRepository } from '../sorbent-trap/sorbent-trap.repository';
import { SamplingTrainService } from '../sampling-train/sampling-train.service';
import { SamplingTrainRepository } from '../sampling-train/sampling-train.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DailyEmissionRepository,
      DailyFuelRepository,
      EmissionsRepository,
      EmissionsSubmissionsProgressRepository,
      SamplingTrainRepository,
      SorbentTrapRepository,
    ]),
    DailyEmissionModule,
    DailyTestSummaryModule,
    HourlyOperatingModule,
    HourlyParameterFuelFlowModule,
  ],
  controllers: [EmissionsController],
  providers: [
    DailyEmissionService,
    DailyEmissionMap,
    DailyFuelMap,
    DailyFuelService,
    EmissionsMap,
    EmissionsService,
    EmissionsSubmissionsProgressMap,
    SamplingTrainService,
    SorbentTrapService,
  ],
})
export class EmissionsModule {}
