import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorLocationWorkspaceRepository } from './monitor-location.repository';
import { MonitorLocationChecksService } from './monitor-location-checks.service';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorLocationWorkspaceRepository])],
  controllers: [],
  providers: [MonitorLocationChecksService],
  exports: [TypeOrmModule, MonitorLocationChecksService],
})
export class MonitorLocationWorkspaceModule {}
