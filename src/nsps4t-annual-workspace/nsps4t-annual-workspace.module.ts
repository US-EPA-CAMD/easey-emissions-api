import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BulkLoadModule } from '@us-epa-camd/easey-common/bulk-load';

import { Nsps4tAnnualMap } from '../maps/nsps4t-annual.map';
import { Nsps4tAnnualWorkspaceRepository } from './nsps4t-annual-workspace.repository';
import { Nsps4tAnnualWorkspaceService } from './nsps4t-annual-workspace.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Nsps4tAnnualWorkspaceRepository]),
    BulkLoadModule,
  ],
  providers: [
    Nsps4tAnnualWorkspaceRepository,
    Nsps4tAnnualWorkspaceService,
    Nsps4tAnnualMap,
  ],
  exports: [
    TypeOrmModule,
    Nsps4tAnnualWorkspaceRepository,
    Nsps4tAnnualMap,
    Nsps4tAnnualWorkspaceService,
  ],
})
export class Nsps4tAnnualWorkspaceModule {}
