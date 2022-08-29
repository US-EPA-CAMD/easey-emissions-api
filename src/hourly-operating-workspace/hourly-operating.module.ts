import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import { HourlyOperatingWorkspaceRepository } from './hourly-operating.repository';
import { HourlyOperatingWorkspaceService } from './hourly-operating.service';
import { MonitorHourlyValueWorkspaceModule } from '../monitor-hourly-value-workspace/monitor-hourly-value.module';
import { MatsMonitorHourlyValueWorkspaceModule } from '../mats-monitor-hourly-value-workspace/mats-monitor-hourly-value.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HourlyOperatingWorkspaceRepository]),
    MonitorHourlyValueWorkspaceModule,
    MatsMonitorHourlyValueWorkspaceModule,
  ],
  controllers: [],
  providers: [HourlyOperatingMap, HourlyOperatingWorkspaceService],
  exports: [TypeOrmModule, HourlyOperatingMap, HourlyOperatingWorkspaceService],
})
export class HourlyOperatingWorkspaceModule {}
