import { Module } from '@nestjs/common';
import { DailyEmissionWorkspaceService } from './daily-emission-workspace.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyEmissionWorkspaceRepository } from './daily-emission-workspace.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DailyEmissionWorkspaceRepository])],
  providers: [DailyEmissionWorkspaceService],
})
export class DailyEmissionWorkspaceModule {}
