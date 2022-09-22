import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EmissionsWorkspaceRepository,
      PlantRepository,
      MonitorFormulaRepository,
      ComponentRepository,
      MonitorSystemRepository,
      MonitorPlanWorkspaceRepository,
    ]),
    DailyTestSummaryWorkspaceModule,
    HourlyOperatingWorkspaceModule,
    Logger,
    MonitorLocationWorkspaceModule,
    MonitorPlanWorkspaceModule,
    WeeklyTestSummaryWorkspaceModule,
    HourlyFuelFlowWorkspaceModule,
  ],
  controllers: [EmissionsWorkspaceController],
  providers: [
    DailyTestSummaryCheckService,
    EmissionsMap,
    EmissionsWorkspaceService,
    EmissionsSubmissionsProgressMap,
    EmissionsChecksService,
    MonitorPlanChecksService,
  ],
})
export class EmissionsWorkspaceModule {}
