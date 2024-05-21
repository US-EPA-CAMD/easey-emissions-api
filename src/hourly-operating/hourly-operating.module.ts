import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DerivedHourlyValueModule } from '../derived-hourly-value/derived-hourly-value.module';
import { HourlyFuelFlowModule } from '../hourly-fuel-flow/hourly-fuel-flow.module';
import { HourlyGasFlowMeterModule } from '../hourly-gas-flow-meter/hourly-gas-flow-meter.module';
import { HourlyParameterFuelFlowModule } from '../hourly-parameter-fuel-flow/hourly-parameter-fuel-flow.module';
import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import { MatsDerivedHourlyValueModule } from '../mats-derived-hourly-value/mats-derived-hourly-value.module';
import { MatsMonitorHourlyValueModule } from '../mats-monitor-hourly-value/mats-monitor-hourly-value.module';
import { MonitorHourlyValueModule } from '../monitor-hourly-value/monitor-hourly-value.module';
import { HourlyOperatingRepository } from './hourly-operating.repository';
import { HourlyOperatingService } from './hourly-operating.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([HourlyOperatingRepository]),
    DerivedHourlyValueModule,
    HourlyFuelFlowModule,
    HourlyParameterFuelFlowModule,
    MonitorHourlyValueModule,
    MatsMonitorHourlyValueModule,
    MatsDerivedHourlyValueModule,
    HourlyGasFlowMeterModule,
  ],
  controllers: [],
  providers: [
    HourlyOperatingMap,
    HourlyOperatingRepository,
    HourlyOperatingService,
  ],
  exports: [
    TypeOrmModule,
    HourlyOperatingMap,
    HourlyOperatingRepository,
    HourlyOperatingService,
  ],
})
export class HourlyOperatingModule {}
