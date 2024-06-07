import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DailyCalibrationModule } from '../daily-calibration/daily-calibration.module';
import { DailyTestSummaryMap } from '../maps/daily-test-summary.map';
import { DailyTestSummaryRepository } from './daily-test-summary.repository';
import { DailyTestSummaryService } from './daily-test-summary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DailyTestSummaryRepository]),
    DailyCalibrationModule,
  ],
  controllers: [],
  providers: [
    DailyTestSummaryMap,
    DailyTestSummaryRepository,
    DailyTestSummaryService,
  ],
  exports: [
    TypeOrmModule,
    DailyTestSummaryMap,
    DailyTestSummaryRepository,
    DailyTestSummaryService,
  ],
})
export class DailyTestSummaryModule {}
