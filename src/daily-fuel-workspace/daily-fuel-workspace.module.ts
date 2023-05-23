import { Module } from '@nestjs/common';
import { DailyFuelWorkspaceService } from './daily-fuel-workspace.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyFuelWorkspaceRepository } from './daily-fuel-workspace.repository';
import { DailyFuelMap } from '../maps/daily-fuel.map';
import { BulkLoadModule } from '@us-epa-camd/easey-common/bulk-load';

@Module({
  imports: [
    TypeOrmModule.forFeature([DailyFuelWorkspaceRepository]),
    BulkLoadModule,
  ],
  providers: [DailyFuelMap, DailyFuelWorkspaceService],
  exports: [TypeOrmModule, DailyFuelMap, DailyFuelWorkspaceService],
})
export class DailyFuelWorkspaceModule {}
