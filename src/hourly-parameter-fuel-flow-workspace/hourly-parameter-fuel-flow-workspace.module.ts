import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BulkLoadModule } from '@us-epa-camd/easey-common/bulk-load';

import { HourlyParameterFuelFlowMap } from '../maps/hourly-parameter-fuel-flow.map';
import { HourlyParameterFuelFlowWorkspaceRepository } from './hourly-parameter-fuel-flow-workspace.repository';
import { HourlyParameterFuelFlowWorkspaceService } from './hourly-parameter-fuel-flow-workspace.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([HourlyParameterFuelFlowWorkspaceRepository]),
    BulkLoadModule,
  ],
  providers: [
    HourlyParameterFuelFlowWorkspaceRepository,
    HourlyParameterFuelFlowWorkspaceService,
    HourlyParameterFuelFlowMap,
  ],
})
export class HourlyParameterFuelFlowWorkspaceModule {}
