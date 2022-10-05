import { Module } from '@nestjs/common';
import { Nsps4tCompliancePeriodWorkspaceService } from './nsps4t-compliance-period-workspace.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nsps4tCompliancePeriodWorkspaceRepository } from './nsps4t-compliance-period-workspace.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Nsps4tCompliancePeriodWorkspaceRepository]),
  ],
  providers: [Nsps4tCompliancePeriodWorkspaceService],
})
export class Nsps4tCompliancePeriodWorkspaceModule {}
