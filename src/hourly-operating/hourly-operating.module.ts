import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatsMonitorHourlyValueModule } from '../mats-monitor-hourly-value/mats-monitor-hourly-value.module';

import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import { MonitorHourlyValueModule } from '../monitor-hourly-value/monitor-hourly-value.module';
import { HourlyOperatingRepository } from './hourly-operating.repository';
import { HourlyOperatingService } from './hourly-operating.service';
import { MatsDerivedHourlyValueModule } from '../mats-derived-hourly-value/mats-derived-hourly-value.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HourlyOperatingRepository]),
    MonitorHourlyValueModule,
    MatsMonitorHourlyValueModule,
    MatsDerivedHourlyValueModule,
  ],
  controllers: [],
  providers: [HourlyOperatingMap, HourlyOperatingService],
  exports: [TypeOrmModule, HourlyOperatingMap, HourlyOperatingService],
})
export class HourlyOperatingModule {}
