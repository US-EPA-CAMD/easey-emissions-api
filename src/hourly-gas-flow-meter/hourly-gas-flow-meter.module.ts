import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HourlyGasFlowMeterMap } from '../maps/hourly-gas-flow-meter.map';
import { HourlyGasFlowMeterRepository } from './hourly-gas-flow-meter.repository';
import { HourlyGasFlowMeterService } from './hourly-gas-flow-meter.service';

@Module({
  imports: [TypeOrmModule.forFeature([HourlyGasFlowMeterRepository])],
  providers: [
    HourlyGasFlowMeterMap,
    HourlyGasFlowMeterRepository,
    HourlyGasFlowMeterService,
  ],
  exports: [
    TypeOrmModule,
    HourlyGasFlowMeterRepository,
    HourlyGasFlowMeterMap,
    HourlyGasFlowMeterService,
  ],
})
export class HourlyGasFlowMeterModule {}
