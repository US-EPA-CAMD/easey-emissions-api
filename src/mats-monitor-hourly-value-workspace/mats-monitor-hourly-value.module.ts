import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BulkLoadModule } from '@us-epa-camd/easey-common/bulk-load';

import { MatsMonitorHourlyValueMap } from '../maps/mats-monitor-hourly-value.map';
import { MatsMonitorHourlyValueWorkspaceRepository } from './mats-monitor-hourly-value.repository';
import { MatsMonitorHourlyValueWorkspaceService } from './mats-monitor-hourly-value.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MatsMonitorHourlyValueWorkspaceRepository]),
    BulkLoadModule,
  ],
  providers: [
    MatsMonitorHourlyValueMap,
    MatsMonitorHourlyValueWorkspaceRepository,
    MatsMonitorHourlyValueWorkspaceService,
  ],
  exports: [
    TypeOrmModule,
    MatsMonitorHourlyValueMap,
    MatsMonitorHourlyValueWorkspaceRepository,
    MatsMonitorHourlyValueWorkspaceService,
  ],
})
export class MatsMonitorHourlyValueWorkspaceModule {}
