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

@Module({
  imports: [
    TypeOrmModule.forFeature([EmissionsWorkspaceRepository]),
    TypeOrmModule.forFeature([PlantRepository]),
    DailyTestSummaryWorkspaceModule,
    HourlyOperatingWorkspaceModule,
    MonitorLocationWorkspaceModule,
    WeeklyTestSummaryWorkspaceModule,
  ],
  controllers: [EmissionsWorkspaceController],
  providers: [
    EmissionsMap,
    EmissionsWorkspaceService,
    EmissionsSubmissionsProgressMap,
    EmissionsChecksService,
  ],
})
export class EmissionsWorkspaceModule {}
