import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BulkLoadModule } from '@us-epa-camd/easey-common/bulk-load';
import { MonitorHourlyValueMap } from '../maps/monitor-hourly-value.map';
import { MonitorHourlyValueWorkspaceRepository } from './monitor-hourly-value.repository';
import { MonitorHourlyValueWorkspaceService } from './monitor-hourly-value.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MonitorHourlyValueWorkspaceRepository]),
    BulkLoadModule,
  ],
  providers: [
    MonitorHourlyValueMap,
    MonitorHourlyValueWorkspaceRepository,
    MonitorHourlyValueWorkspaceService,
  ],
  exports: [
    TypeOrmModule,
    MonitorHourlyValueMap,
    MonitorHourlyValueWorkspaceService,
  ],
})
export class MonitorHourlyValueWorkspaceModule {}
