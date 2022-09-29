import { Module } from '@nestjs/common';
import { DailyFuelWorkspaceService } from './daily-fuel-workspace.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyFuelWorkspaceRepository } from './daily-fuel-workspace.repository';
import { DailyFuelMap } from '../maps/daily-fuel.map';

@Module({
  imports: [TypeOrmModule.forFeature([DailyFuelWorkspaceRepository])],
  providers: [DailyFuelMap, DailyFuelWorkspaceService],
})
export class DailyFuelWorkspaceModule {}
