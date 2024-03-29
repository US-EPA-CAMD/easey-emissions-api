import { Module } from '@nestjs/common';
import { HourlyParameterFuelFlowMap } from '../maps/hourly-parameter-fuel-flow.map';
import { HourlyParameterFuelFlowRepository } from './hourly-parameter-fuel-flow.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HourlyParameterFuelFlowService } from './hourly-parameter-fuel-flow.service';

@Module({
  imports: [TypeOrmModule.forFeature([HourlyParameterFuelFlowRepository])],
  providers: [HourlyParameterFuelFlowService, HourlyParameterFuelFlowMap],
})
export class HourlyParameterFuelFlowModule {}
