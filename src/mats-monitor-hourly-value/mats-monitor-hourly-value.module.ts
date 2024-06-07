import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatsMonitorHourlyValueMap } from '../maps/mats-monitor-hourly-value.map';
import { MatsMonitorHourlyValueRepository } from './mats-monitor-hourly-value.repository';
import { MatsMonitorHourlyValueService } from './mats-monitor-hourly-value.service';

@Module({
  imports: [TypeOrmModule.forFeature([MatsMonitorHourlyValueRepository])],
  providers: [
    MatsMonitorHourlyValueMap,
    MatsMonitorHourlyValueRepository,
    MatsMonitorHourlyValueService,
  ],
  exports: [
    TypeOrmModule,
    MatsMonitorHourlyValueMap,
    MatsMonitorHourlyValueRepository,
    MatsMonitorHourlyValueService,
  ],
})
export class MatsMonitorHourlyValueModule {}
