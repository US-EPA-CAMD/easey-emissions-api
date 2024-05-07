import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  BulkLoadModule,
  BulkLoadService,
} from '@us-epa-camd/easey-common/bulk-load';

import { Nsps4tSummaryMap } from 'src/maps/nsps4t-summary.map';
import { Nsps4tAnnualWorkspaceRepository } from '../nsps4t-annual-workspace/nsps4t-annual-workspace.repository';
import { Nsps4tAnnualWorkspaceService } from '../nsps4t-annual-workspace/nsps4t-annual-workspace.service';
import { Nsps4tCompliancePeriodWorkspaceRepository } from '../nsps4t-compliance-period-workspace/nsps4t-compliance-period-workspace.repository';
import { Nsps4tCompliancePeriodWorkspaceService } from '../nsps4t-compliance-period-workspace/nsps4t-compliance-period-workspace.service';
import { Nsps4tSummaryWorkspaceRepository } from './nsps4t-summary-workspace.repository';
import { Nsps4tSummaryWorkspaceService } from './nsps4t-summary-workspace.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Nsps4tAnnualWorkspaceRepository,
      Nsps4tCompliancePeriodWorkspaceRepository,
      Nsps4tSummaryWorkspaceRepository,
    ]),
    BulkLoadModule,
  ],
  providers: [
    BulkLoadService,
    Nsps4tAnnualWorkspaceRepository,
    Nsps4tAnnualWorkspaceService,
    Nsps4tCompliancePeriodWorkspaceRepository,
    Nsps4tCompliancePeriodWorkspaceService,
    Nsps4tSummaryMap,
    Nsps4tSummaryWorkspaceRepository,
    Nsps4tSummaryWorkspaceService,
  ],
  exports: [TypeOrmModule, Nsps4tSummaryMap, BulkLoadService],
})
export class Nsps4tSummaryWorkspaceModule {}
