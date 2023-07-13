import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DailyTestSummaryWorkspaceModule } from '../daily-test-summary-workspace/daily-test-summary.module';

import { EmissionsWorkspaceController } from './emissions.controller';
import { EmissionsWorkspaceService } from './emissions.service';
import { EmissionsWorkspaceRepository } from './emissions.repository';

import { EmissionsMap } from '../maps/emissions.map';
import { EmissionsSubmissionsProgressMap } from '../maps/emissions-submissions-progress.map';
import { EmissionsChecksService } from './emissions-checks.service';
import { PlantRepository } from '../plant/plant.repository';
import { HourlyOperatingWorkspaceModule } from '../hourly-operating-workspace/hourly-operating.module';
import { MonitorLocationWorkspaceModule } from '../monitor-location-workspace/monitor-location.module';
import { WeeklyTestSummaryWorkspaceModule } from '../weekly-test-summary-workspace/weekly-test-summary.module';
import { MonitorFormulaRepository } from '../monitor-formula/monitor-formula.repository';
import { DailyTestSummaryCheckService } from '../daily-test-summary-workspace/daily-test-summary-check.service';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { ComponentRepository } from '../component/component.repository';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { MonitorPlanChecksService } from '../monitor-plan-workspace/monitor-plan-checks.service';
import { MonitorPlanWorkspaceRepository } from '../monitor-plan-workspace/monitor-plan-repository';
import { HourlyFuelFlowWorkspaceModule } from '../hourly-fuel-flow-workspace/hourly-fuel-flow-workspace.module';
import { DailyEmissionWorkspaceModule } from '../daily-emission-workspace/daily-emission-workspace.module';
import { DailyEmissionWorkspaceService } from '../daily-emission-workspace/daily-emission-workspace.service';
import { DailyEmissionMap } from '../maps/daily-emission.map';
import { DailyEmissionWorkspaceRepository } from '../daily-emission-workspace/daily-emission-workspace.repository';
import { DailyFuelWorkspaceService } from '../daily-fuel-workspace/daily-fuel-workspace.service';
import { DailyFuelWorkspaceRepository } from '../daily-fuel-workspace/daily-fuel-workspace.repository';
import { DailyFuelMap } from '../maps/daily-fuel.map';
import { SummaryValueWorkspaceModule } from '../summary-value-workspace/summary-value.module';
import { SorbentTrapWorkspaceService } from '../sorbent-trap-workspace/sorbent-trap-workspace.service';
import { SamplingTrainWorkspaceService } from '../sampling-train-workspace/sampling-train-workspace.service';
import { SorbentTrapWorkspaceRepository } from '../sorbent-trap-workspace/sorbent-trap-workspace.repository';
import { SamplingTrainWorkspaceRepository } from '../sampling-train-workspace/sampling-train-workspace.repository';
import { Nsps4tSummaryWorkspaceService } from '../nsps4t-summary-workspace/nsps4t-summary-workspace.service';
import { Nsps4tAnnualWorkspaceService } from '../nsps4t-annual-workspace/nsps4t-annual-workspace.service';
import { Nsps4tCompliancePeriodWorkspaceService } from '../nsps4t-compliance-period-workspace/nsps4t-compliance-period-workspace.service';
import { Nsps4tSummaryWorkspaceRepository } from '../nsps4t-summary-workspace/nsps4t-summary-workspace.repository';
import { Nsps4tAnnualWorkspaceRepository } from '../nsps4t-annual-workspace/nsps4t-annual-workspace.repository';
import { Nsps4tCompliancePeriodWorkspaceRepository } from '../nsps4t-compliance-period-workspace/nsps4t-compliance-period-workspace.repository';
import { EmissionsReviewSubmitRepository } from './ReviewSubmit.repository';
import { ReviewSubmitService } from './ReviewSubmit.service';
import { EmissionsReviewSubmitMap } from '../maps/emissions-review-submit.map';
import { LongTermFuelFlowWorkspaceRepository } from '../long-term-fuel-flow-workspace/long-term-fuel-flow.repository';
import { LongTermFuelFlowWorkspaceModule } from '../long-term-fuel-flow-workspace/long-term-fuel-flow.module';
import { LongTermFuelFlowWorkspaceService } from '../long-term-fuel-flow-workspace/long-term-fuel-flow.service';
import { DailyBackstopWorkspaceModule } from '../daily-backstop-workspace/daily-backstop.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DailyEmissionWorkspaceRepository,
      DailyFuelWorkspaceRepository,
      EmissionsWorkspaceRepository,
      PlantRepository,
      MonitorFormulaRepository,
      ComponentRepository,
      MonitorSystemRepository,
      MonitorPlanWorkspaceRepository,
      SorbentTrapWorkspaceRepository,
      SamplingTrainWorkspaceRepository,
      Nsps4tSummaryWorkspaceRepository,
      Nsps4tAnnualWorkspaceRepository,
      Nsps4tCompliancePeriodWorkspaceRepository,
      EmissionsReviewSubmitRepository,
      LongTermFuelFlowWorkspaceRepository,
    ]),
    Logger,
    HttpModule,
    DailyEmissionWorkspaceModule,
    DailyTestSummaryWorkspaceModule,
    HourlyOperatingWorkspaceModule,
    MonitorLocationWorkspaceModule,
    MonitorPlanWorkspaceModule,
    WeeklyTestSummaryWorkspaceModule,
    HourlyFuelFlowWorkspaceModule,
    SummaryValueWorkspaceModule,
    LongTermFuelFlowWorkspaceModule,
    DailyBackstopWorkspaceModule,
  ],
  controllers: [EmissionsWorkspaceController],
  providers: [
    DailyEmissionWorkspaceService,
    DailyEmissionMap,
    DailyFuelMap,
    DailyFuelWorkspaceService,
    DailyTestSummaryCheckService,
    EmissionsMap,
    EmissionsWorkspaceService,
    EmissionsSubmissionsProgressMap,
    EmissionsChecksService,
    MonitorPlanChecksService,
    SorbentTrapWorkspaceService,
    SamplingTrainWorkspaceService,
    Nsps4tAnnualWorkspaceService,
    Nsps4tSummaryWorkspaceService,
    Nsps4tCompliancePeriodWorkspaceService,
    ReviewSubmitService,
    EmissionsReviewSubmitMap,
    LongTermFuelFlowWorkspaceService,
  ],
})
export class EmissionsWorkspaceModule {}
