import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HourlyParameterFuelFlowModule } from '../hourly-parameter-fuel-flow/hourly-parameter-fuel-flow.module';
import { HourlyFuelFlowMap } from '../maps/hourly-fuel-flow-map';
import { HourlyFuelFlowRepository } from './hourly-fuel-flow.repository';
import { HourlyFuelFlowService } from './hourly-fuel-flow.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([HourlyFuelFlowRepository]),
    HourlyParameterFuelFlowModule,
  ],
  providers: [
    HourlyFuelFlowRepository,
    HourlyFuelFlowService,
    HourlyFuelFlowMap,
  ],
  exports: [
    TypeOrmModule,
    HourlyFuelFlowRepository,
    HourlyFuelFlowService,
    HourlyFuelFlowMap,
  ],
})
export class HourlyFuelFlowModule {}
