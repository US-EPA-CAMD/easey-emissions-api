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
import { MatsDerivedHrlyValueService } from '../mats-derived-hrly-value-workspace/mats-derived-hrly-value.service';
import { MatsDerivedHrlyValueRepository } from '../mats-derived-hrly-value-workspace/mats-derived-hrly-value.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmissionsWorkspaceRepository]),
    TypeOrmModule.forFeature([PlantRepository]),
    TypeOrmModule.forFeature([MatsDerivedHrlyValueRepository]),
    DailyTestSummaryWorkspaceModule,
  ],
  controllers: [EmissionsWorkspaceController],
  providers: [
    EmissionsMap,
    EmissionsWorkspaceService,
    EmissionsSubmissionsProgressMap,
    EmissionsChecksService,
    MatsDerivedHrlyValueService,
    WeeklyTestSummaryCheckService,
  ],
})
export class EmissionsWorkspaceModule {}
