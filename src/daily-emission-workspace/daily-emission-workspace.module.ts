import { Module } from '@nestjs/common';
import { DailyEmissionWorkspaceService } from './daily-emission-workspace.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyEmissionWorkspaceRepository } from './daily-emission-workspace.repository';
import { DailyEmissionMap } from '../maps/daily-emission.map';
import {
  BulkLoadModule,
  BulkLoadService,
} from '@us-epa-camd/easey-common/bulk-load';
import { DailyFuelWorkspaceModule } from '../daily-fuel-workspace/daily-fuel-workspace.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DailyEmissionWorkspaceRepository]),
    DailyFuelWorkspaceModule,
    BulkLoadModule,
  ],
  providers: [
    DailyEmissionMap,
    DailyEmissionWorkspaceRepository,
    DailyEmissionWorkspaceService,
    BulkLoadService,
  ],
  exports: [
    TypeOrmModule,
    DailyEmissionMap,
    DailyEmissionWorkspaceService,
    BulkLoadService,
  ],
})
export class DailyEmissionWorkspaceModule {}
