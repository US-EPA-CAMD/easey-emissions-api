import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BulkLoadModule } from '@us-epa-camd/easey-common/bulk-load';

import { HourlyParameterFuelFlowWorkspaceModule } from '../hourly-parameter-fuel-flow-workspace/hourly-parameter-fuel-flow-workspace.module';
import { HourlyFuelFlowMap } from '../maps/hourly-fuel-flow-map';
import { HourlyFuelFlowWorkspaceRepository } from './hourly-fuel-flow-workspace.repository';
import { HourlyFuelFlowWorkspaceService } from './hourly-fuel-flow-workspace.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([HourlyFuelFlowWorkspaceRepository]),
    BulkLoadModule,
    HourlyParameterFuelFlowWorkspaceModule,
  ],
  providers: [
    HourlyFuelFlowWorkspaceRepository,
    HourlyFuelFlowWorkspaceService,
    HourlyFuelFlowMap,
  ],
  exports: [
    TypeOrmModule,
    HourlyFuelFlowWorkspaceRepository,
    HourlyFuelFlowWorkspaceService,
    HourlyFuelFlowMap,
  ],
})
export class HourlyFuelFlowWorkspaceModule {}
