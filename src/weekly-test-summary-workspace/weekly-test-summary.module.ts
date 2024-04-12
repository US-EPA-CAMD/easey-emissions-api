import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeeklyTestSummaryMap } from '../maps/weekly-test-summary.map';
import { WeeklySystemIntegrityWorkspaceModule } from '../weekly-system-integrity-workspace/weekly-system-integrity.module';

import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { WeeklyTestSummaryCheckService } from './weekly-test-summary-check.service';
import { WeeklyTestSummaryWorkspaceRepository } from './weekly-test-summary.repository';
import { WeeklyTestSummaryWorkspaceService } from './weekly-test-summary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([WeeklyTestSummaryWorkspaceRepository]),
    WeeklySystemIntegrityWorkspaceModule,
    BulkLoadService,
  ],
  controllers: [],
  providers: [
    WeeklyTestSummaryMap,
    WeeklyTestSummaryWorkspaceRepository,
    WeeklyTestSummaryWorkspaceService,
    WeeklyTestSummaryCheckService,
  ],
  exports: [
    WeeklyTestSummaryCheckService,
    WeeklyTestSummaryMap,
    WeeklyTestSummaryWorkspaceService,
  ],
})
export class WeeklyTestSummaryWorkspaceModule {}
