import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Nsps4tCompliancePeriodRepository } from './nsps4t-compliance-period.repository';
import { Nsps4tCompliancePeriodService } from './nsps4t-compliance-period.service';

@Module({
  imports: [TypeOrmModule.forFeature([Nsps4tCompliancePeriodRepository])],
  providers: [Nsps4tCompliancePeriodRepository, Nsps4tCompliancePeriodService],
  exports: [
    TypeOrmModule,
    Nsps4tCompliancePeriodRepository,
    Nsps4tCompliancePeriodService,
  ],
})
export class Nsps4tCompliancePeriodModule {}
