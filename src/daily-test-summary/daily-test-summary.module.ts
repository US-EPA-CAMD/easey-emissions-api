import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DailyCalibrationModule } from '../daily-calibration/daily-calibration.module';

import { DailyTestSummaryMap } from '../maps/daily-test-summary.map';
import { DailyTestSummaryService } from './daily-test-summary.service';
import { DailyTestSummaryRepository } from './daily-test-summary.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([DailyTestSummaryRepository]),
    DailyCalibrationModule,
  ],
  controllers: [],
  providers: [DailyTestSummaryMap, DailyTestSummaryService],
  exports: [TypeOrmModule, DailyTestSummaryMap, DailyTestSummaryService],
})
export class DailyTestSummaryModule {}
