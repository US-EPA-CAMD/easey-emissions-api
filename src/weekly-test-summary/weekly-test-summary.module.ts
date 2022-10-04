import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WeeklyTestSummaryMap } from '../maps/weekly-test-summary.map';
import { WeeklyTestSummaryRepository } from './weekly-test-summary.repository';
import { WeeklyTestSummaryService } from './weekly-test-summary.service';
import { WeeklySystemIntegrityModule } from '../weekly-system-integrity/weekly-system-integrity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WeeklyTestSummaryRepository]),
    WeeklySystemIntegrityModule,
  ],
  controllers: [],
  providers: [WeeklyTestSummaryMap, WeeklyTestSummaryService,],
  exports: [TypeOrmModule, WeeklyTestSummaryMap, WeeklyTestSummaryService],
})
export class WeeklyTestSummaryModule {}
