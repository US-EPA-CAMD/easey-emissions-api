import { Module } from '@nestjs/common';
import { Nsps4tSummaryService } from './nsps4t-summary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nsps4tSummaryRepository } from './nsps4t-summary.repository';
import { Nsps4tAnnualService } from '../nsps4t-annual/nsps4t-annual.service';
import { Nsps4tCompliancePeriodService } from '../nsps4t-compliance-period/nsps4t-compliance-period.service';
import { Nsps4tAnnualRepository } from '../nsps4t-annual/nsps4t-annual.repository';
import { Nsps4tCompliancePeriodRepository } from '../nsps4t-compliance-period/nsps4t-compliance-period.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Nsps4tAnnualRepository,
      Nsps4tCompliancePeriodRepository,
      Nsps4tSummaryRepository,
    ]),
  ],
  providers: [
    Nsps4tAnnualService,
    Nsps4tCompliancePeriodService,
    Nsps4tSummaryService,
  ],
})
export class Nsps4tSummaryModule {}
