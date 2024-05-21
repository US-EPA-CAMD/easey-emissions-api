import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BulkLoadModule } from '@us-epa-camd/easey-common/bulk-load';

import { Nsps4tSummaryMap } from 'src/maps/nsps4t-summary.map';
import { Nsps4tAnnualWorkspaceModule } from '../nsps4t-annual-workspace/nsps4t-annual-workspace.module';
import { Nsps4tCompliancePeriodWorkspaceModule } from '../nsps4t-compliance-period-workspace/nsps4t-compliance-period-workspace.module';
import { Nsps4tSummaryWorkspaceRepository } from './nsps4t-summary-workspace.repository';
import { Nsps4tSummaryWorkspaceService } from './nsps4t-summary-workspace.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Nsps4tSummaryWorkspaceRepository]),
    BulkLoadModule,
    Nsps4tAnnualWorkspaceModule,
    Nsps4tCompliancePeriodWorkspaceModule,
  ],
  providers: [
    Nsps4tSummaryMap,
    Nsps4tSummaryWorkspaceRepository,
    Nsps4tSummaryWorkspaceService,
  ],
  exports: [
    TypeOrmModule,
    Nsps4tSummaryMap,
    Nsps4tSummaryWorkspaceRepository,
    Nsps4tSummaryWorkspaceService,
  ],
})
export class Nsps4tSummaryWorkspaceModule {}
