import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BulkLoadModule } from '@us-epa-camd/easey-common/bulk-load';

import { HourlyParameterFuelFlowWorkspaceRepository } from '../hourly-parameter-fuel-flow-workspace/hourly-parameter-fuel-flow-workspace.repository';
import { HourlyParameterFuelFlowWorkspaceService } from '../hourly-parameter-fuel-flow-workspace/hourly-parameter-fuel-flow-workspace.service';
import { HourlyFuelFlowMap } from '../maps/hourly-fuel-flow-map';
import { HourlyParameterFuelFlowMap } from '../maps/hourly-parameter-fuel-flow.map';
import { HourlyFuelFlowWorkspaceRepository } from './hourly-fuel-flow-workspace.repository';
import { HourlyFuelFlowWorkspaceService } from './hourly-fuel-flow-workspace.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HourlyFuelFlowWorkspaceRepository,
      HourlyParameterFuelFlowWorkspaceRepository,
    ]),
    BulkLoadModule,
  ],
  providers: [
    HourlyFuelFlowWorkspaceRepository,
    HourlyFuelFlowWorkspaceService,
    HourlyParameterFuelFlowWorkspaceRepository,
    HourlyParameterFuelFlowWorkspaceService,
    HourlyFuelFlowMap,
    HourlyParameterFuelFlowMap,
  ],
})
export class HourlyFuelFlowWorkspaceModule {}
