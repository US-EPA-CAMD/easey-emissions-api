import { Module } from '@nestjs/common';
import { HourlyParameterFuelFlowMap } from '../maps/hourly-parameter-fuel-flow.map';
import { HourlyParameterFuelFlowWorkspaceRepository } from './hourly-parameter-fuel-flow-workspace.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HourlyParameterFuelFlowWorkspaceService } from './hourly-parameter-fuel-flow-workspace.service';
import { BulkLoadModule } from '@us-epa-camd/easey-common/bulk-load';

@Module({
  imports: [
    TypeOrmModule.forFeature([HourlyParameterFuelFlowWorkspaceRepository]),
    BulkLoadModule,
  ],
  providers: [
    HourlyParameterFuelFlowWorkspaceService,
    HourlyParameterFuelFlowMap,
  ],
})
export class HourlyParameterFuelFlowWorkspaceModule {}
