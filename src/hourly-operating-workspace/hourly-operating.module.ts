import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import { HourlyOperatingWorkspaceRepository } from './hourly-operating.repository';
import { HourlyOperatingWorkspaceService } from './hourly-operating.service';
import { MonitorHourlyValueWorkspaceModule } from '../monitor-hourly-value-workspace/monitor-hourly-value.module';
import { DerivedHourlyValueWorkspaceService } from '../derived-hourly-value-workspace/derived-hourly-value-workspace.service';
import { DerivedHourlyValueWorkspaceRepository } from '../derived-hourly-value-workspace/derived-hourly-value-workspace.repository';
import { MatsMonitorHourlyValueWorkspaceModule } from '../mats-monitor-hourly-value-workspace/mats-monitor-hourly-value.module';
import { MatsDerivedHourlyValueWorkspaceModule } from '../mats-derived-hourly-value-workspace/mats-derived-hourly-value.module';
import { DerivedHourlyValueMap } from '../maps/derived-hourly-value.map';
import { HourlyFuelFlowWorkspaceService } from '../hourly-fuel-flow-workspace/hourly-fuel-flow-workspace.service';
import { HourlyFuelFlowWorkspaceRepository } from '../hourly-fuel-flow-workspace/hourly-fuel-flow-workspace.repository';
import { HourlyFuelFlowMap } from '../maps/hourly-fuel-flow-map';
import { HourlyParameterFuelFlowWorkspaceService } from '../hourly-parameter-fuel-flow-workspace/hourly-parameter-fuel-flow-workspace.service';
import { HourlyParameterFuelFlowMap } from '../maps/hourly-parameter-fuel-flow.map';
import { HourlyParameterFuelFlowWorkspaceRepository } from '../hourly-parameter-fuel-flow-workspace/hourly-parameter-fuel-flow-workspace.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DerivedHourlyValueWorkspaceRepository,
      HourlyOperatingWorkspaceRepository,
      HourlyFuelFlowWorkspaceRepository,
      HourlyParameterFuelFlowWorkspaceRepository,
    ]),
    MonitorHourlyValueWorkspaceModule,
    MatsMonitorHourlyValueWorkspaceModule,
    MatsDerivedHourlyValueWorkspaceModule,
  ],
  controllers: [],
  providers: [
    DerivedHourlyValueMap,
    DerivedHourlyValueWorkspaceService,
    HourlyFuelFlowMap,
    HourlyOperatingMap,
    HourlyOperatingWorkspaceService,
    HourlyFuelFlowWorkspaceService,
    HourlyParameterFuelFlowWorkspaceService,
    HourlyParameterFuelFlowMap,
  ],
  exports: [TypeOrmModule, HourlyOperatingMap, HourlyOperatingWorkspaceService],
})
export class HourlyOperatingWorkspaceModule {}
