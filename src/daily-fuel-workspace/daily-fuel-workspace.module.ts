import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BulkLoadModule } from '@us-epa-camd/easey-common/bulk-load';

import { DailyFuelMap } from '../maps/daily-fuel.map';
import { DailyFuelWorkspaceRepository } from './daily-fuel-workspace.repository';
import { DailyFuelWorkspaceService } from './daily-fuel-workspace.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DailyFuelWorkspaceRepository]),
    BulkLoadModule,
  ],
  providers: [
    DailyFuelMap,
    DailyFuelWorkspaceRepository,
    DailyFuelWorkspaceService,
  ],
  exports: [TypeOrmModule, DailyFuelMap, DailyFuelWorkspaceService],
})
export class DailyFuelWorkspaceModule {}
