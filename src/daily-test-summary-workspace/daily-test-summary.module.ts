import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BulkLoadModule } from '@us-epa-camd/easey-common/bulk-load';

import { DailyCalibrationWorkspaceModule } from '../daily-calibration-workspace/daily-calibration.module';
import { DailyTestSummaryMap } from '../maps/daily-test-summary.map';
import { DailyTestSummaryCheckService } from './daily-test-summary-check.service';
import { DailyTestSummaryWorkspaceRepository } from './daily-test-summary.repository';
import { DailyTestSummaryWorkspaceService } from './daily-test-summary.service';
import { PlantRepository } from '../plant/plant.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([DailyTestSummaryWorkspaceRepository]),
    DailyCalibrationWorkspaceModule,
    BulkLoadModule,
  ],
  controllers: [],
  providers: [
    DailyTestSummaryMap,
    DailyTestSummaryWorkspaceRepository,
    DailyTestSummaryWorkspaceService,
    DailyTestSummaryCheckService,
    PlantRepository,
  ],
  exports: [
    TypeOrmModule,
    DailyTestSummaryMap,
    DailyTestSummaryWorkspaceRepository,
    DailyTestSummaryWorkspaceService,
    DailyTestSummaryCheckService,
  ],
})
export class DailyTestSummaryWorkspaceModule {}
