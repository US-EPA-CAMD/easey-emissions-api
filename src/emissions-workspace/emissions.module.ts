import { HttpModule } from '@nestjs/axios';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { CodeChecksModule } from '../code-checks/code-checks.module';
import { ComponentModule } from '../component/component.module';
import { DailyBackstopWorkspaceModule } from '../daily-backstop-workspace/daily-backstop.module';
import { DailyEmissionWorkspaceModule } from '../daily-emission-workspace/daily-emission-workspace.module';
import { DailyFuelWorkspaceModule } from '../daily-fuel-workspace/daily-fuel-workspace.module';
import { DailyTestSummaryWorkspaceModule } from '../daily-test-summary-workspace/daily-test-summary.module';
import { EaseyContentModule } from '../emissions-easey-content/easey-content.module';
import { EmissionsModule } from '../emissions/emissions.module';
import { HourlyFuelFlowWorkspaceModule } from '../hourly-fuel-flow-workspace/hourly-fuel-flow-workspace.module';
import { HourlyOperatingWorkspaceModule } from '../hourly-operating-workspace/hourly-operating.module';
import { LongTermFuelFlowWorkspaceModule } from '../long-term-fuel-flow-workspace/long-term-fuel-flow.module';
import { EmissionsReviewMap } from '../maps/emissions-review.map';
import { EmissionsSubmissionsProgressMap } from '../maps/emissions-submissions-progress.map';
import { EmissionsMap } from '../maps/emissions.map';
import { MonitorFormulaModule } from '../monitor-formula/monitor-formula.module';
import { MonitorLocationWorkspaceModule } from '../monitor-location-workspace/monitor-location.module';
import { MonitorPlanWorkspaceModule } from '../monitor-plan-workspace/monitor-plan.module';
import { MonitorSystemModule } from '../monitor-system/monitor-system.module';
import { Nsps4tAnnualWorkspaceModule } from '../nsps4t-annual-workspace/nsps4t-annual-workspace.module';
import { Nsps4tCompliancePeriodWorkspaceModule } from '../nsps4t-compliance-period-workspace/nsps4t-compliance-period-workspace.module';
import { Nsps4tSummaryWorkspaceModule } from '../nsps4t-summary-workspace/nsps4t-summary-workspace.module';
import { PlantModule } from '../plant/plant.module';
import { SamplingTrainWorkspaceModule } from '../sampling-train-workspace/sampling-train-workspace.module';
import { SorbentTrapWorkspaceModule } from '../sorbent-trap-workspace/sorbent-trap-workspace.module';
import { SummaryValueWorkspaceModule } from '../summary-value-workspace/summary-value.module';
import { WeeklyTestSummaryWorkspaceModule } from '../weekly-test-summary-workspace/weekly-test-summary.module';
import { EmissionsChecksService } from './emissions-checks.service';
import { EmissionsWorkspaceController } from './emissions.controller';
import { EmissionsWorkspaceRepository } from './emissions.repository';
import { EmissionsWorkspaceService } from './emissions.service';
import { ReviewSubmitService } from './ReviewSubmit.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EmissionsWorkspaceRepository,
    ]),
    EaseyContentModule,
    ComponentModule,
    LoggerModule,
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
    forwardRef(() => EmissionsModule),
  ],
  controllers: [EmissionsWorkspaceController],
  providers: [
    EmissionsWorkspaceRepository,
    EmissionsMap,
    EmissionsReviewMap,
    EmissionsSubmissionsProgressMap,
    EmissionsWorkspaceService,
    EmissionsChecksService,
    ReviewSubmitService,
  ],
  exports: [
    TypeOrmModule,
    EmissionsWorkspaceRepository,
    EmissionsMap,
    EmissionsReviewMap,
    EmissionsSubmissionsProgressMap,
    EmissionsWorkspaceService,
    EmissionsChecksService,
    ReviewSubmitService,
  ],
})
export class EmissionsWorkspaceModule {}
