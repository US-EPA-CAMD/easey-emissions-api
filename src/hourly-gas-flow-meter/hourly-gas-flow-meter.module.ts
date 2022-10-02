import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HourlyGasFlowMeterRepository } from './hourly-gas-flow-meter.repository';
import { HourlyGasFlowMeterMap } from '../maps/hourly-gas-flow-meter.map';
import { HourlyGasFlowMeterService } from './hourly-gas-flow-meter.service';

@Module({
  imports: [TypeOrmModule.forFeature([HourlyGasFlowMeterRepository])],
  providers: [HourlyGasFlowMeterMap, HourlyGasFlowMeterService],
  exports: [TypeOrmModule, HourlyGasFlowMeterMap, HourlyGasFlowMeterService],
})
export class HourlyGasFlowMeterModule {}
