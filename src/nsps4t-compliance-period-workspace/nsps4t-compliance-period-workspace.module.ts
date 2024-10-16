import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BulkLoadModule } from '@us-epa-camd/easey-common/bulk-load';

import { Nsps4tCompliancePeriodMap } from '../maps/nsps4t-compliance-period.map';
import { Nsps4tCompliancePeriodWorkspaceRepository } from './nsps4t-compliance-period-workspace.repository';
import { Nsps4tCompliancePeriodWorkspaceService } from './nsps4t-compliance-period-workspace.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Nsps4tCompliancePeriodWorkspaceRepository]),
    BulkLoadModule,
  ],
  providers: [
    Nsps4tCompliancePeriodWorkspaceRepository,
    Nsps4tCompliancePeriodWorkspaceService,
    Nsps4tCompliancePeriodMap,
  ],
  exports: [
    TypeOrmModule,
    Nsps4tCompliancePeriodMap,
    Nsps4tCompliancePeriodWorkspaceRepository,
    Nsps4tCompliancePeriodWorkspaceService,
  ],
})
export class Nsps4tCompliancePeriodWorkspaceModule {}
