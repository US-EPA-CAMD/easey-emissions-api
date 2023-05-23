import { Module } from '@nestjs/common';
import { Nsps4tAnnualWorkspaceService } from './nsps4t-annual-workspace.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nsps4tAnnualWorkspaceRepository } from './nsps4t-annual-workspace.repository';
import {
  BulkLoadModule,
  BulkLoadService,
} from '@us-epa-camd/easey-common/bulk-load';
import { Nsps4tAnnualMap } from '../maps/nsps4t-annual.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([Nsps4tAnnualWorkspaceRepository]),
    BulkLoadModule,
  ],
  providers: [Nsps4tAnnualWorkspaceService, BulkLoadService, Nsps4tAnnualMap],
  exports: [TypeOrmModule, Nsps4tAnnualMap, BulkLoadService],
})
export class Nsps4tAnnualWorkspaceModule {}
