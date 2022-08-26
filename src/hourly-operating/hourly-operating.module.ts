import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatsMonitorHourlyValueModule } from '../mats-monitor-hourly-value/mats-monitor-hourly-value.module';

import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import { MonitorHourlyValueModule } from '../monitor-hourly-value/monitor-hourly-value.module';
import { HourlyOperatingRepository } from './hourly-operating.repository';
import { HourlyOperatingService } from './hourly-operating.service';
import { DerivedHourlyValueService } from '../derived-hourly-value/derived-hourly-value.service';
import { DerivedHourlyValueRepository } from '../derived-hourly-value/derived-hourly-value.repository';
import { DerivedHourlyValueMap } from '../derived-hourly-value/derived-hourly-value.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DerivedHourlyValueRepository,
      HourlyOperatingRepository,
    ]),
    MonitorHourlyValueModule,
    MatsMonitorHourlyValueModule,
  ],
  controllers: [],
  providers: [
    DerivedHourlyValueMap,
    DerivedHourlyValueService,
    HourlyOperatingMap,
    HourlyOperatingService,
  ],
  exports: [TypeOrmModule, HourlyOperatingMap, HourlyOperatingService],
})
export class HourlyOperatingModule {}
