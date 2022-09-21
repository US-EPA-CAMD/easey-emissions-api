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
import { HourlyGasFlowMeterWorkspaceModule } from '../hourly-gas-flow-meter-workspace/hourly-gas-flow-meter.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DerivedHourlyValueWorkspaceRepository,
      HourlyOperatingWorkspaceRepository,
    ]),
    MonitorHourlyValueWorkspaceModule,
    MatsMonitorHourlyValueWorkspaceModule,
    MatsDerivedHourlyValueWorkspaceModule,
    HourlyGasFlowMeterWorkspaceModule,
  ],
  controllers: [],
  providers: [
    DerivedHourlyValueMap,
    DerivedHourlyValueWorkspaceService,
    HourlyOperatingMap,
    HourlyOperatingWorkspaceService,
  ],
  exports: [TypeOrmModule, HourlyOperatingMap, HourlyOperatingWorkspaceService],
})
export class HourlyOperatingWorkspaceModule {}
