import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BulkLoadModule } from '@us-epa-camd/easey-common/bulk-load';

import { HourlyGasFlowMeterMap } from '../maps/hourly-gas-flow-meter.map';
import { HourlyGasFlowMeterWorkspaceRepository } from './hourly-gas-flow-meter.repository';
import { HourlyGasFlowMeterWorkspaceService } from './hourly-gas-flow-meter.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([HourlyGasFlowMeterWorkspaceRepository]),
    BulkLoadModule,
  ],
  providers: [
    HourlyGasFlowMeterMap,
    HourlyGasFlowMeterWorkspaceRepository,
    HourlyGasFlowMeterWorkspaceService,
  ],
  exports: [
    TypeOrmModule,
    HourlyGasFlowMeterMap,
    HourlyGasFlowMeterWorkspaceService,
  ],
})
export class HourlyGasFlowMeterWorkspaceModule {}
