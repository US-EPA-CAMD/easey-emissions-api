import { Module } from '@nestjs/common';
import { Nsps4tCompliancePeriodService } from './nsps4t-compliance-period.service';

@Module({
  providers: [Nsps4tCompliancePeriodService],
})
export class Nsps4tCompliancePeriodModule {}
