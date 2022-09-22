import { Module } from '@nestjs/common';
import { HourlyFuelFlowService } from './hourly-fuel-flow.service';
import { HourlyParameterFuelFlowService } from '../hourly-parameter-fuel-flow/hourly-parameter-fuel-flow.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HourlyFuelFlowRepository } from './hourly-fuel-flow.repository';
import { HourlyFuelFlowMap } from '../maps/hourly-fuel-flow-map';
import { HourlyParameterFuelFlowMap } from '../maps/hourly-parameter-fuel-flow.map';
import { HourlyParameterFuelFlowRepository } from '../hourly-parameter-fuel-flow/hourly-parameter-fuel-flow.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HourlyFuelFlowRepository,
      HourlyParameterFuelFlowRepository,
    ]),
  ],
  providers: [
    HourlyFuelFlowService,
    HourlyParameterFuelFlowService,
    HourlyFuelFlowMap,
    HourlyParameterFuelFlowMap,
  ],
})
export class HourlyFuelFlowModule {}
