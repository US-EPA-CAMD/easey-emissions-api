import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorLocationChecksService } from './monitor-location-checks.service';
import { MonitorLocationWorkspaceRepository } from './monitor-location.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorLocationWorkspaceRepository])],
  controllers: [],
  providers: [MonitorLocationWorkspaceRepository, MonitorLocationChecksService],
  exports: [TypeOrmModule, MonitorLocationChecksService],
})
export class MonitorLocationWorkspaceModule {}
