import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DailyBackstopModule } from '../daily-backstop/daily-backstop.module';
import { DailyEmissionModule } from '../daily-emission/daily-emission.module';
import { DailyFuelModule } from '../daily-fuel/daily-fuel.module';
import { DailyTestSummaryModule } from '../daily-test-summary/daily-test-summary.module';
import { EmissionsViewModule } from '../emission-view/emissions-view.module';
import { EmissionsViewWorkspaceModule } from '../emissions-view-workspace/emissions-view.module';
import { EmissionsWorkspaceModule } from '../emissions-workspace/emissions.module';
import { HourlyOperatingModule } from '../hourly-operating/hourly-operating.module';
import { HourlyParameterFuelFlowModule } from '../hourly-parameter-fuel-flow/hourly-parameter-fuel-flow.module';
import { LongTermFuelFlowModule } from '../long-term-fuel-flow/long-term-fuel-flow.module';
import { EmissionsSubmissionsProgressMap } from '../maps/emissions-submissions-progress.map';
import { EmissionsMap } from '../maps/emissions.map';
import { Nsps4tAnnualModule } from '../nsps4t-annual/nsps4t-annual.module';
import { Nsps4tCompliancePeriodModule } from '../nsps4t-compliance-period/nsps4t-compliance-period.module';
import { Nsps4tSummaryModule } from '../nsps4t-summary/nsps4t-summary.module';
import { SamplingTrainModule } from '../sampling-train/sampling-train.module';
import { SorbentTrapModule } from '../sorbent-trap/sorbent-trap.module';
import { SummaryValueModule } from '../summary-value/summary-value.module';
import { WeeklyTestSummaryModule } from '../weekly-test-summary/weekly-test-summary.module';
import { EmissionsSubmissionsProgressRepository } from './emissions-submissions-progress.repository';
import { EmissionsController } from './emissions.controller';
import { EmissionsRepository } from './emissions.repository';
import { EmissionsService } from './emissions.service';
import { EaseyContentModule } from '../emissions-easey-content/easey-content.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EmissionsRepository,
      EmissionsSubmissionsProgressRepository,
    ]),
    EaseyContentModule,
    EmissionsViewWorkspaceModule,
    EmissionsViewModule,
    DailyEmissionModule,
    DailyFuelModule,
    DailyTestSummaryModule,
    HourlyOperatingModule,
    WeeklyTestSummaryModule,
    HourlyParameterFuelFlowModule,
    SummaryValueModule,
    LongTermFuelFlowModule,
    DailyBackstopModule,
    EmissionsWorkspaceModule,
    Nsps4tAnnualModule,
    Nsps4tCompliancePeriodModule,
    Nsps4tSummaryModule,
    SamplingTrainModule,
    SorbentTrapModule,
  ],
  controllers: [EmissionsController],
  providers: [
    EmissionsMap,
    EmissionsRepository,
    EmissionsService,
    EmissionsSubmissionsProgressRepository,
    EmissionsSubmissionsProgressMap,
  ],
  exports: [
    TypeOrmModule,
    EmissionsMap,
    EmissionsRepository,
    EmissionsService,
    EmissionsSubmissionsProgressRepository,
    EmissionsSubmissionsProgressMap,
  ],
})
export class EmissionsModule {}
