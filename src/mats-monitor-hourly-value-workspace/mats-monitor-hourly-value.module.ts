import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatsMonitorHourlyValueMap } from '../maps/mats-monitor-hourly-value.map';
import { MatsMonitorHourlyValueWorkspaceRepository } from './mats-monitor-hourly-value.repository';
import { MatsMonitorHourlyValueWorkspaceService } from './mats-monitor-hourly-value.service';
import { BulkLoadModule } from '@us-epa-camd/easey-common/bulk-load';

@Module({
  imports: [
    TypeOrmModule.forFeature([MatsMonitorHourlyValueWorkspaceRepository]),
    BulkLoadModule,
  ],
  providers: [
    MatsMonitorHourlyValueMap,
    MatsMonitorHourlyValueWorkspaceService,
  ],
  exports: [
    TypeOrmModule,
    MatsMonitorHourlyValueMap,
    MatsMonitorHourlyValueWorkspaceService,
  ],
})
export class MatsMonitorHourlyValueWorkspaceModule {}
