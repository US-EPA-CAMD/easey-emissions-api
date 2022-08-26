import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DailyTestSummaryWorkspaceModule } from '../daily-test-summary-workspace/daily-test-summary.module';

import { EmissionsWorkspaceController } from './emissions.controller';
import { EmissionsWorkspaceService } from './emissions.service';
import { EmissionsWorkspaceRepository } from './emissions.repository';

import { EmissionsMap } from '../maps/emissions.map';
import { EmissionsSubmissionsProgressMap } from '../maps/emissions-submissions-progress.map';
import { EmissionsChecksService } from './emissions-checks.service';
import { WeeklyTestSummaryCheckService } from 'src/weekly-test-summary-workspace/weekly-test-summary-check.service';
import { PlantRepository } from '../plant/plant.repository';
import { HourlyOperatingDataWorkspaceService } from '../hourly-operating-data-workspace/hourly-operating-data-workspace.service';
import { HourlyOperatingDataWorkspaceRepository } from '../hourly-operating-data-workspace/hourly-operating-data-workspace.repository';
import { DerivedHourlyValueWorkspaceService } from '../derived-hourly-value-workspace/derived-hourly-value-workspace.service';
import { DerivedHourlyValueWorkspaceRepository } from '../derived-hourly-value-workspace/derived-hourly-value-workspace.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HourlyOperatingDataWorkspaceRepository,
      DerivedHourlyValueWorkspaceRepository,
      EmissionsWorkspaceRepository,
      PlantRepository,
    ]),
    DailyTestSummaryWorkspaceModule,
  ],
  controllers: [EmissionsWorkspaceController],
  providers: [
    HourlyOperatingDataWorkspaceService,
    DerivedHourlyValueWorkspaceService,
    EmissionsMap,
    EmissionsWorkspaceService,
    EmissionsSubmissionsProgressMap,
    EmissionsChecksService,
    WeeklyTestSummaryCheckService,
  ],
})
export class EmissionsWorkspaceModule {}
