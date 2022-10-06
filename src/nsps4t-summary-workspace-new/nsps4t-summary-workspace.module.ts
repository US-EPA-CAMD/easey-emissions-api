import { Module } from '@nestjs/common';
import { Nsps4tSummaryWorkspaceService } from './nsps4t-summary-workspace.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nsps4tSummaryWorkspaceRepository } from './nsps4t-summary-workspace.repository';
import { Nsps4tAnnualWorkspaceService } from '../nsps4t-annual-workspace/nsps4t-annual-workspace.service';
import { Nsps4tCompliancePeriodWorkspaceService } from '../nsps4t-compliance-period-workspace/nsps4t-compliance-period-workspace.service';
import { Nsps4tAnnualWorkspaceRepository } from '../nsps4t-annual-workspace/nsps4t-annual-workspace.repository';
import { Nsps4tCompliancePeriodWorkspaceRepository } from '../nsps4t-compliance-period-workspace/nsps4t-compliance-period-workspace.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Nsps4tAnnualWorkspaceRepository,
      Nsps4tCompliancePeriodWorkspaceRepository,
      Nsps4tSummaryWorkspaceRepository,
    ]),
  ],
  providers: [
    Nsps4tAnnualWorkspaceService,
    Nsps4tCompliancePeriodWorkspaceService,
    Nsps4tSummaryWorkspaceService,
  ],
})
export class Nsps4tSummaryWorkspaceModule {}
