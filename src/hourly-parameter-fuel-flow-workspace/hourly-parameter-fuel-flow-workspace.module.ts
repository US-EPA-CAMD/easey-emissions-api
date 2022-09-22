import { Module } from '@nestjs/common';
import { HourlyParameterFuelFlowMap } from '../maps/hourly-parameter-fuel-flow.map';
import { HourlyParameterFuelFlowWorkspaceRepository } from './hourly-parameter-fuel-flow-workspace.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HourlyParameterFuelFlowWorkspaceService } from './hourly-parameter-fuel-flow-workspace.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([HourlyParameterFuelFlowWorkspaceRepository]),
  ],
  providers: [
    HourlyParameterFuelFlowWorkspaceService,
    HourlyParameterFuelFlowMap,
  ],
})
export class HourlyParameterFuelFlowWorkspaceModule {}
