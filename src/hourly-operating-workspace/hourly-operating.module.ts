import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BulkLoadModule } from '@us-epa-camd/easey-common/bulk-load';

import { DerivedHourlyValueWorkspaceModule } from '../derived-hourly-value-workspace/derived-hourly-value-workspace.module';
import { HourlyFuelFlowWorkspaceModule } from '../hourly-fuel-flow-workspace/hourly-fuel-flow-workspace.module';
import { HourlyGasFlowMeterWorkspaceModule } from '../hourly-gas-flow-meter-workspace/hourly-gas-flow-meter.module';
import { HourlyParameterFuelFlowWorkspaceModule } from '../hourly-parameter-fuel-flow-workspace/hourly-parameter-fuel-flow-workspace.module';
import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import { MatsDerivedHourlyValueWorkspaceModule } from '../mats-derived-hourly-value-workspace/mats-derived-hourly-value.module';
import { MatsMonitorHourlyValueWorkspaceModule } from '../mats-monitor-hourly-value-workspace/mats-monitor-hourly-value.module';
import { MonitorHourlyValueWorkspaceModule } from '../monitor-hourly-value-workspace/monitor-hourly-value.module';
import { HourlyOperatingWorkspaceRepository } from './hourly-operating.repository';
import { HourlyOperatingWorkspaceService } from './hourly-operating.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([HourlyOperatingWorkspaceRepository]),
    DerivedHourlyValueWorkspaceModule,
    HourlyFuelFlowWorkspaceModule,
    HourlyParameterFuelFlowWorkspaceModule,
    MonitorHourlyValueWorkspaceModule,
    MatsMonitorHourlyValueWorkspaceModule,
    MatsDerivedHourlyValueWorkspaceModule,
    HourlyGasFlowMeterWorkspaceModule,
    BulkLoadModule,
  ],
  controllers: [],
  providers: [
    HourlyOperatingMap,
    HourlyOperatingWorkspaceRepository,
    HourlyOperatingWorkspaceService,
  ],
  exports: [
    TypeOrmModule,
    HourlyOperatingMap,
    HourlyOperatingWorkspaceRepository,
    HourlyOperatingWorkspaceService,
  ],
})
export class HourlyOperatingWorkspaceModule {}
