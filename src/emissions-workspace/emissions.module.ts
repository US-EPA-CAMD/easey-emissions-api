import { Logger } from '@us-epa-camd/easey-common/logger';
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
import { PlantModule } from '../plant/plant.module';
import { HourlyOperatingWorkspaceModule } from '../hourly-operating-workspace/hourly-operating.module';
import { MonitorLocationWorkspaceModule } from '../monitor-location-workspace/monitor-location.module';
import { WeeklyTestSummaryWorkspaceModule } from '../weekly-test-summary-workspace/weekly-test-summary.module';
import { MonitorFormulaModule } from '../monitor-formula/monitor-formula.module';
import { DailyTestSummaryCheckService } from '../daily-test-summary-workspace/daily-test-summary-check.service';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { ComponentModule } from '../component/component.module';
import { MonitorSystemModule } from '../monitor-system/monitor-system.module';
import { MonitorPlanChecksService } from '../monitor-plan-workspace/monitor-plan-checks.service';
import { HourlyFuelFlowWorkspaceModule } from '../hourly-fuel-flow-workspace/hourly-fuel-flow-workspace.module';
import { DailyEmissionWorkspaceModule } from '../daily-emission-workspace/daily-emission-workspace.module';
import { DailyEmissionWorkspaceService } from '../daily-emission-workspace/daily-emission-workspace.service';
import { DailyEmissionMap } from '../maps/daily-emission.map';
import { DailyFuelWorkspaceService } from '../daily-fuel-workspace/daily-fuel-workspace.service';
import { DailyFuelWorkspaceModule } from '../daily-fuel-workspace/daily-fuel-workspace.module';
import { DailyFuelMap } from '../maps/daily-fuel.map';
import { SummaryValueWorkspaceModule } from '../summary-value-workspace/summary-value.module';
import { SorbentTrapWorkspaceService } from '../sorbent-trap-workspace/sorbent-trap-workspace.service';
import { SamplingTrainWorkspaceService } from '../sampling-train-workspace/sampling-train-workspace.service';
import { SorbentTrapWorkspaceModule } from '../sorbent-trap-workspace/sorbent-trap-workspace.module';
import { SamplingTrainWorkspaceModule } from '../sampling-train-workspace/sampling-train-workspace.module';
import { Nsps4tSummaryWorkspaceService } from '../nsps4t-summary-workspace/nsps4t-summary-workspace.service';
import { Nsps4tAnnualWorkspaceService } from '../nsps4t-annual-workspace/nsps4t-annual-workspace.service';
import { Nsps4tCompliancePeriodWorkspaceService } from '../nsps4t-compliance-period-workspace/nsps4t-compliance-period-workspace.service';
import { Nsps4tSummaryWorkspaceModule } from '../nsps4t-summary-workspace/nsps4t-summary-workspace.module';
import { Nsps4tAnnualWorkspaceModule } from '../nsps4t-annual-workspace/nsps4t-annual-workspace.module';
import { Nsps4tCompliancePeriodWorkspaceModule } from '../nsps4t-compliance-period-workspace/nsps4t-compliance-period-workspace.module';
import { EmissionsReviewSubmitRepository } from './ReviewSubmit.repository';
import { ReviewSubmitService } from './ReviewSubmit.service';
import { EmissionsReviewSubmitMap } from '../maps/emissions-review-submit.map';
import { LongTermFuelFlowWorkspaceModule } from '../long-term-fuel-flow-workspace/long-term-fuel-flow.module';
import { LongTermFuelFlowWorkspaceService } from '../long-term-fuel-flow-workspace/long-term-fuel-flow.service';
import { DailyBackstopWorkspaceModule } from '../daily-backstop-workspace/daily-backstop.module';
import { EmissionsReviewSubmitGlobalRepository } from './ReviewSubmitGlobal.repository';
import { CodeChecksModule } from '../code-checks/code-checks.module';
import { CodeChecksService } from '../code-checks/code-checks.service';
import { EaseyContentModule } from '../emissions-easey-content/easey-content.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EmissionsWorkspaceRepository,
      EmissionsReviewSubmitRepository,
      EmissionsReviewSubmitGlobalRepository,
    ]),
    EaseyContentModule,
    ComponentModule,
    Logger,
    HttpModule,
    DailyEmissionWorkspaceModule,
    DailyFuelWorkspaceModule,
    DailyTestSummaryWorkspaceModule,
    HourlyOperatingWorkspaceModule,
    MonitorLocationWorkspaceModule,
    MonitorPlanWorkspaceModule,
    PlantModule,
    WeeklyTestSummaryWorkspaceModule,
    HourlyFuelFlowWorkspaceModule,
    SummaryValueWorkspaceModule,
    LongTermFuelFlowWorkspaceModule,
    DailyBackstopWorkspaceModule,
    CodeChecksModule,
    MonitorFormulaModule,
    MonitorSystemModule,
    SorbentTrapWorkspaceModule,
    SamplingTrainWorkspaceModule,
    Nsps4tSummaryWorkspaceModule,
    Nsps4tAnnualWorkspaceModule,
    Nsps4tCompliancePeriodWorkspaceModule,
  ],
  controllers: [EmissionsWorkspaceController],
  providers: [
    EmissionsWorkspaceRepository,
    EmissionsReviewSubmitRepository,
    EmissionsReviewSubmitGlobalRepository,
    EmissionsMap,
    EmissionsReviewSubmitMap,
    EmissionsSubmissionsProgressMap,
    EmissionsWorkspaceService,
    EmissionsChecksService,
    ReviewSubmitService,
  ],
  exports: [
    TypeOrmModule,
    EmissionsWorkspaceRepository,
    EmissionsReviewSubmitRepository,
    EmissionsReviewSubmitGlobalRepository,
    EmissionsMap,
    EmissionsReviewSubmitMap,
    EmissionsSubmissionsProgressMap,
    EmissionsWorkspaceService,
    EmissionsChecksService,
    ReviewSubmitService,
  ],
})
export class EmissionsWorkspaceModule {}
