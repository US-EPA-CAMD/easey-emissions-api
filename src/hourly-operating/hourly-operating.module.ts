import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatsMonitorHourlyValueModule } from '../mats-monitor-hourly-value/mats-monitor-hourly-value.module';
import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import { MonitorHourlyValueModule } from '../monitor-hourly-value/monitor-hourly-value.module';
import { HourlyOperatingRepository } from './hourly-operating.repository';
import { HourlyOperatingService } from './hourly-operating.service';
import { MatsDerivedHourlyValueModule } from '../mats-derived-hourly-value/mats-derived-hourly-value.module';
import { DerivedHourlyValueService } from '../derived-hourly-value/derived-hourly-value.service';
import { DerivedHourlyValueRepository } from '../derived-hourly-value/derived-hourly-value.repository';
import { DerivedHourlyValueMap } from '../maps/derived-hourly-value.map';
import { HourlyGasFlowMeterModule } from '../hourly-gas-flow-meter/hourly-gas-flow-meter.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DerivedHourlyValueRepository,
      HourlyOperatingRepository,
    ]),
    MonitorHourlyValueModule,
    MatsMonitorHourlyValueModule,
    MatsDerivedHourlyValueModule,
    HourlyGasFlowMeterModule,
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
