import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorPlanChecksService } from './monitor-plan-checks.service';
import { MonitorPlanWorkspaceRepository } from './monitor-plan-repository';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorPlanWorkspaceRepository])],
  controllers: [],
  providers: [MonitorPlanWorkspaceRepository, MonitorPlanChecksService],
  exports: [TypeOrmModule, MonitorPlanChecksService],
})
export class MonitorPlanWorkspaceModule {}
