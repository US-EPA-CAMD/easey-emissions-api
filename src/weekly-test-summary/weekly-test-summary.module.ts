import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WeeklyTestSummaryMap } from '../maps/weekly-test-summary.map';
import { WeeklySystemIntegrityModule } from '../weekly-system-integrity/weekly-system-integrity.module';
import { WeeklyTestSummaryRepository } from './weekly-test-summary.repository';
import { WeeklyTestSummaryService } from './weekly-test-summary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([WeeklyTestSummaryRepository]),
    WeeklySystemIntegrityModule,
  ],
  controllers: [],
  providers: [
    WeeklyTestSummaryMap,
    WeeklyTestSummaryRepository,
    WeeklyTestSummaryService,
  ],
  exports: [TypeOrmModule, WeeklyTestSummaryMap, WeeklyTestSummaryService],
})
export class WeeklyTestSummaryModule {}
