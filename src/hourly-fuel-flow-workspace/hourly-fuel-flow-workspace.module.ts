import { Module } from '@nestjs/common';
import { HourlyFuelFlowWorkspaceService } from './hourly-fuel-flow-workspace.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HourlyFuelFlowMap } from '../maps/hourly-fuel-flow-map';
import { HourlyParameterFuelFlowMap } from '../maps/hourly-parameter-fuel-flow.map';
import { HourlyFuelFlowWorkspaceRepository } from './hourly-fuel-flow-workspace.repository';
import { HourlyParameterFuelFlowWorkspaceRepository } from '../hourly-parameter-fuel-flow-workspace/hourly-parameter-fuel-flow-workspace.repository';
import { HourlyParameterFuelFlowWorkspaceService } from '../hourly-parameter-fuel-flow-workspace/hourly-parameter-fuel-flow-workspace.service';
import { BulkLoadModule } from '@us-epa-camd/easey-common/bulk-load';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HourlyFuelFlowWorkspaceRepository,
      HourlyParameterFuelFlowWorkspaceRepository,
    ]),
    BulkLoadModule,
  ],
  providers: [
    HourlyFuelFlowWorkspaceService,
    HourlyParameterFuelFlowWorkspaceService,
    HourlyFuelFlowMap,
    HourlyParameterFuelFlowMap,
  ],
})
export class HourlyFuelFlowWorkspaceModule {}
