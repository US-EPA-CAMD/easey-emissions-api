import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DailyCalibrationWorkspaceModule } from '../daily-calibration-workspace/daily-calibration.module';

import { DailyTestSummaryMap } from '../maps/daily-test-summary.map';
import { DailyTestSummaryWorkspaceService } from './daily-test-summary.service';
import { DailyTestSummaryWorkspaceRepository } from './daily-test-summary.repository';
import { DailyTestSummaryCheckService } from './daily-test-summary-check.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DailyTestSummaryWorkspaceRepository]),
    DailyCalibrationWorkspaceModule,
  ],
  controllers: [],
  providers: [
    DailyTestSummaryMap,
    DailyTestSummaryWorkspaceService,
    DailyTestSummaryCheckService
  ],
  exports: [
    TypeOrmModule,
    DailyTestSummaryMap,
    DailyTestSummaryWorkspaceService,
    DailyTestSummaryCheckService,
  ],
})
export class DailyTestSummaryWorkspaceModule {}
