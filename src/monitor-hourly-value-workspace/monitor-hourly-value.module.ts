import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorHourlyValueMap } from '../maps/monitor-hourly-value.map';
import { MonitorHourlyValueWorkspaceRepository } from './monitor-hourly-value.repository';
import { MonitorHourlyValueWorkspaceService } from './monitor-hourly-value.service';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorHourlyValueWorkspaceRepository])],
  providers: [MonitorHourlyValueMap, MonitorHourlyValueWorkspaceService],
  exports: [
    TypeOrmModule,
    MonitorHourlyValueMap,
    MonitorHourlyValueWorkspaceService,
  ],
})
export class MonitorHourlyValueWorkspaceModule {}
