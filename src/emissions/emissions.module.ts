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
import { WeeklyTestSummaryModule } from '../weekly-test-summary/weekly-test-summary.module';
import { SummaryValueModule } from '../summary-value/summary-value.module';
import { Nsps4tSummaryService } from '../nsps4t-summary/nsps4t-summary.service';
import { Nsps4tSummaryRepository } from '../nsps4t-summary/nsps4t-summary.repository';
import { Nsps4tAnnualService } from '../nsps4t-annual/nsps4t-annual.service';
import { Nsps4tCompliancePeriodService } from '../nsps4t-compliance-period/nsps4t-compliance-period.service';
import { Nsps4tAnnualRepository } from '../nsps4t-annual/nsps4t-annual.repository';
import { Nsps4tCompliancePeriodRepository } from '../nsps4t-compliance-period/nsps4t-compliance-period.repository';
import { EmissionsViewModule } from '../emission-view/emissions-view.module';
import { EmissionsViewWorkspaceModule } from '../emissions-view-workspace/emissions-view.module';
import { LongTermFuelFlowRepository } from '../long-term-fuel-flow/long-term-fuel-flow.repository';
import { LongTermFuelFlowModule } from '../long-term-fuel-flow/long-term-fuel-flow.module';
import { LongTermFuelFlowService } from '../long-term-fuel-flow/long-term-fuel-flow.service';
import { DailyBackstopModule } from '../daily-backstop/daily-backstop.module';
import { EmissionsWorkspaceModule } from '../emissions-workspace/emissions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DailyEmissionRepository,
      DailyFuelRepository,
      EmissionsRepository,
      EmissionsSubmissionsProgressRepository,
      Nsps4tAnnualRepository,
      Nsps4tCompliancePeriodRepository,
      Nsps4tSummaryRepository,
      SamplingTrainRepository,
      SorbentTrapRepository,
      LongTermFuelFlowRepository,
    ]),
    EmissionsViewWorkspaceModule,
    EmissionsViewModule,
    DailyEmissionModule,
    DailyTestSummaryModule,
    HourlyOperatingModule,
    WeeklyTestSummaryModule,
    HourlyParameterFuelFlowModule,
    SummaryValueModule,
    LongTermFuelFlowModule,
    DailyBackstopModule,
    EmissionsWorkspaceModule,
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
    Nsps4tAnnualService,
    Nsps4tCompliancePeriodService,
    Nsps4tSummaryService,
    SamplingTrainService,
    SorbentTrapService,
    LongTermFuelFlowService,
  ],
})
export class EmissionsModule {}
