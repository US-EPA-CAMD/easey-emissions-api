import { Module } from '@nestjs/common';
import { DailyEmissionWorkspaceService } from './daily-emission-workspace.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyEmissionWorkspaceRepository } from './daily-emission-workspace.repository';
import { DailyFuelWorkspaceService } from '../daily-fuel-workspace/daily-fuel-workspace.service';
import { DailyFuelWorkspaceRepository } from '../daily-fuel-workspace/daily-fuel-workspace.repository';
import { DailyEmissionMap } from '../maps/daily-emission.map';
import { DailyFuelMap } from '../maps/daily-fuel.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DailyEmissionWorkspaceRepository,
      DailyFuelWorkspaceRepository,
    ]),
  ],
  providers: [
    DailyEmissionMap,
    DailyEmissionWorkspaceService,
    DailyFuelMap,
    DailyFuelWorkspaceService,
  ],
})
export class DailyEmissionWorkspaceModule {}
