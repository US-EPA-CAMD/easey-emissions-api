import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HourlyGasFlowMeterWorkspaceRepository } from './hourly-gas-flow-meter.repository';
import { HourlyGasFlowMeterMap } from '../maps/hourly-gas-flow-meter.map';
import { HourlyGasFlowMeterWorkspaceService } from './hourly-gas-flow-meter.service';
import { BulkLoadModule } from '@us-epa-camd/easey-common/bulk-load';

@Module({
  imports: [
    TypeOrmModule.forFeature([HourlyGasFlowMeterWorkspaceRepository]),
    BulkLoadModule,
  ],
  providers: [HourlyGasFlowMeterMap, HourlyGasFlowMeterWorkspaceService],
  exports: [
    TypeOrmModule,
    HourlyGasFlowMeterMap,
    HourlyGasFlowMeterWorkspaceService,
  ],
})
export class HourlyGasFlowMeterWorkspaceModule {}
