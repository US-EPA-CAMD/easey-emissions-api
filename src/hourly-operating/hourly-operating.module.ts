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
import { HourlyFuelFlowService } from '../hourly-fuel-flow/hourly-fuel-flow.service';
import { HourlyFuelFlowRepository } from '../hourly-fuel-flow/hourly-fuel-flow.repository';
import { HourlyParameterFuelFlowRepository } from '../hourly-parameter-fuel-flow/hourly-parameter-fuel-flow.repository';
import { HourlyFuelFlowMap } from '../maps/hourly-fuel-flow-map';
import { HourlyParameterFuelFlowService } from '../hourly-parameter-fuel-flow/hourly-parameter-fuel-flow.service';
import { HourlyParameterFuelFlowMap } from '../maps/hourly-parameter-fuel-flow.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DerivedHourlyValueRepository,
      HourlyOperatingRepository,
      HourlyFuelFlowRepository,
      HourlyParameterFuelFlowRepository,
    ]),
    MonitorHourlyValueModule,
    MatsMonitorHourlyValueModule,
    MatsDerivedHourlyValueModule,
    HourlyGasFlowMeterModule,
  ],
  controllers: [],
  providers: [
    HourlyFuelFlowMap,
    HourlyParameterFuelFlowService,
    HourlyParameterFuelFlowMap,
    HourlyFuelFlowService,
    DerivedHourlyValueMap,
    DerivedHourlyValueService,
    HourlyOperatingMap,
    HourlyOperatingService,
  ],
  exports: [TypeOrmModule, HourlyOperatingMap, HourlyOperatingService],
})
export class HourlyOperatingModule {}
