import { Module } from '@nestjs/common';
import { Nsps4tCompliancePeriodService } from './nsps4t-compliance-period.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nsps4tCompliancePeriodRepository } from './nsps4t-compliance-period.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Nsps4tCompliancePeriodRepository])],
  providers: [Nsps4tCompliancePeriodService],
})
export class Nsps4tCompliancePeriodModule {}
