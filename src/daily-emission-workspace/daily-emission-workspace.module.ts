import { Module } from '@nestjs/common';
import { DailyEmissionWorkspaceService } from './daily-emission-workspace.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyEmissionWorkspaceRepository } from './daily-emission-workspace.repository';
import { DailyFuelWorkspaceService } from '../daily-fuel-workspace/daily-fuel-workspace.service';
import { DailyFuelWorkspaceRepository } from '../daily-fuel-workspace/daily-fuel-workspace.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DailyEmissionWorkspaceRepository,
      DailyFuelWorkspaceRepository,
    ]),
  ],
  providers: [DailyEmissionWorkspaceService, DailyFuelWorkspaceService],
})
export class DailyEmissionWorkspaceModule {}
