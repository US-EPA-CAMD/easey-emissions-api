import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HourlyParameterFuelFlowRepository } from '../hourly-parameter-fuel-flow/hourly-parameter-fuel-flow.repository';
import { HourlyParameterFuelFlowService } from '../hourly-parameter-fuel-flow/hourly-parameter-fuel-flow.service';
import { HourlyFuelFlowMap } from '../maps/hourly-fuel-flow-map';
import { HourlyParameterFuelFlowMap } from '../maps/hourly-parameter-fuel-flow.map';
import { HourlyFuelFlowRepository } from './hourly-fuel-flow.repository';
import { HourlyFuelFlowService } from './hourly-fuel-flow.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HourlyFuelFlowRepository,
      HourlyParameterFuelFlowRepository,
    ]),
  ],
  providers: [
    HourlyFuelFlowRepository,
    HourlyFuelFlowService,
    HourlyParameterFuelFlowRepository,
    HourlyParameterFuelFlowService,
    HourlyFuelFlowMap,
    HourlyParameterFuelFlowMap,
  ],
})
export class HourlyFuelFlowModule {}
