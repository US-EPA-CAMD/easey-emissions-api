import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DerivedHourlyValueRepository } from '../derived-hourly-value/derived-hourly-value.repository';
import { DerivedHourlyValueService } from '../derived-hourly-value/derived-hourly-value.service';
import { HourlyFuelFlowRepository } from '../hourly-fuel-flow/hourly-fuel-flow.repository';
import { HourlyFuelFlowService } from '../hourly-fuel-flow/hourly-fuel-flow.service';
import { HourlyGasFlowMeterModule } from '../hourly-gas-flow-meter/hourly-gas-flow-meter.module';
import { HourlyParameterFuelFlowRepository } from '../hourly-parameter-fuel-flow/hourly-parameter-fuel-flow.repository';
import { HourlyParameterFuelFlowService } from '../hourly-parameter-fuel-flow/hourly-parameter-fuel-flow.service';
import { DerivedHourlyValueMap } from '../maps/derived-hourly-value.map';
import { HourlyFuelFlowMap } from '../maps/hourly-fuel-flow-map';
import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import { HourlyParameterFuelFlowMap } from '../maps/hourly-parameter-fuel-flow.map';
import { MatsDerivedHourlyValueModule } from '../mats-derived-hourly-value/mats-derived-hourly-value.module';
import { MatsMonitorHourlyValueModule } from '../mats-monitor-hourly-value/mats-monitor-hourly-value.module';
import { MonitorHourlyValueModule } from '../monitor-hourly-value/monitor-hourly-value.module';
import { HourlyOperatingRepository } from './hourly-operating.repository';
import { HourlyOperatingService } from './hourly-operating.service';

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
    DerivedHourlyValueMap,
    DerivedHourlyValueRepository,
    DerivedHourlyValueService,
    HourlyFuelFlowMap,
    HourlyFuelFlowRepository,
    HourlyFuelFlowService,
    HourlyOperatingMap,
    HourlyOperatingRepository,
    HourlyOperatingService,
    HourlyParameterFuelFlowMap,
    HourlyParameterFuelFlowRepository,
    HourlyParameterFuelFlowService,
  ],
  exports: [TypeOrmModule, HourlyOperatingMap, HourlyOperatingService],
})
export class HourlyOperatingModule {}
