import { Module } from '@nestjs/common';

import { WeeklyTestSummaryCheckService } from './weekly-test-summary-check.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ WeeklyTestSummaryCheckService],
  exports: [
    WeeklyTestSummaryCheckService,
  ],
})
export class WeeklyTestSummaryWorkspaceModule {}
