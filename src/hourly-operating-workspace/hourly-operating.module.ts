import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import { HourlyOperatingWorkspaceRepository } from './hourly-operating.repository';
import { HourlyOperatingWorkspaceService } from './hourly-operating.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([HourlyOperatingWorkspaceRepository]),
  ],
  controllers: [],
  providers: [HourlyOperatingMap, HourlyOperatingWorkspaceService],
  exports: [TypeOrmModule, HourlyOperatingMap, HourlyOperatingWorkspaceService],
})
export class HourlyOperatingWorkspaceModule {}
