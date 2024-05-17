import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Nsps4tAnnualModule } from '../nsps4t-annual/nsps4t-annual.module';
import { Nsps4tCompliancePeriodModule } from '../nsps4t-compliance-period/nsps4t-compliance-period.module';
import { Nsps4tSummaryRepository } from './nsps4t-summary.repository';
import { Nsps4tSummaryService } from './nsps4t-summary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Nsps4tSummaryRepository]),
    Nsps4tAnnualModule,
    Nsps4tCompliancePeriodModule,
  ],
  providers: [Nsps4tSummaryRepository, Nsps4tSummaryService],
  exports: [TypeOrmModule, Nsps4tSummaryRepository, Nsps4tSummaryService],
})
export class Nsps4tSummaryModule {}
