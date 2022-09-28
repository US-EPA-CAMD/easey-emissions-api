import { Module } from '@nestjs/common';
import { DailyFuelWorkspaceService } from './daily-fuel-workspace.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyFuelWorkspaceRepository } from './daily-fuel-workspace.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DailyFuelWorkspaceRepository])],
  providers: [DailyFuelWorkspaceService],
})
export class DailyFuelWorkspaceModule {}
