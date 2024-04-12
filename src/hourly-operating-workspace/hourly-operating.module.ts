import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BulkLoadModule } from '@us-epa-camd/easey-common/bulk-load';

import { DerivedHourlyValueWorkspaceRepository } from '../derived-hourly-value-workspace/derived-hourly-value-workspace.repository';
import { DerivedHourlyValueWorkspaceService } from '../derived-hourly-value-workspace/derived-hourly-value-workspace.service';
import { HourlyFuelFlowWorkspaceRepository } from '../hourly-fuel-flow-workspace/hourly-fuel-flow-workspace.repository';
import { HourlyFuelFlowWorkspaceService } from '../hourly-fuel-flow-workspace/hourly-fuel-flow-workspace.service';
import { HourlyGasFlowMeterWorkspaceModule } from '../hourly-gas-flow-meter-workspace/hourly-gas-flow-meter.module';
import { HourlyParameterFuelFlowWorkspaceRepository } from '../hourly-parameter-fuel-flow-workspace/hourly-parameter-fuel-flow-workspace.repository';
import { HourlyParameterFuelFlowWorkspaceService } from '../hourly-parameter-fuel-flow-workspace/hourly-parameter-fuel-flow-workspace.service';
import { DerivedHourlyValueMap } from '../maps/derived-hourly-value.map';
import { HourlyFuelFlowMap } from '../maps/hourly-fuel-flow-map';
import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import { HourlyParameterFuelFlowMap } from '../maps/hourly-parameter-fuel-flow.map';
import { MatsDerivedHourlyValueWorkspaceModule } from '../mats-derived-hourly-value-workspace/mats-derived-hourly-value.module';
import { MatsMonitorHourlyValueWorkspaceModule } from '../mats-monitor-hourly-value-workspace/mats-monitor-hourly-value.module';
import { MonitorHourlyValueWorkspaceModule } from '../monitor-hourly-value-workspace/monitor-hourly-value.module';
import { HourlyOperatingWorkspaceRepository } from './hourly-operating.repository';
import { HourlyOperatingWorkspaceService } from './hourly-operating.service';

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
    HourlyGasFlowMeterWorkspaceModule,
    BulkLoadModule,
  ],
  controllers: [],
  providers: [
    DerivedHourlyValueMap,
    DerivedHourlyValueWorkspaceRepository,
    DerivedHourlyValueWorkspaceService,
    HourlyFuelFlowMap,
    HourlyFuelFlowWorkspaceRepository,
    HourlyFuelFlowWorkspaceService,
    HourlyOperatingMap,
    HourlyOperatingWorkspaceRepository,
    HourlyOperatingWorkspaceService,
    HourlyParameterFuelFlowMap,
    HourlyParameterFuelFlowWorkspaceRepository,
    HourlyParameterFuelFlowWorkspaceService,
  ],
  exports: [TypeOrmModule, HourlyOperatingMap, HourlyOperatingWorkspaceService],
})
export class HourlyOperatingWorkspaceModule {}
