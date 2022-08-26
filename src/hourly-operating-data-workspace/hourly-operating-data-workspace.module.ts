import { Module } from '@nestjs/common';
import { HourlyOperatingDataWorkspaceService } from './hourly-operating-data-workspace.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HourlyOperatingDataWorkspaceRepository } from './hourly-operating-data-workspace.repository';
import { DerivedHourlyValueWorkspaceService } from '../derived-hourly-value-workspace/derived-hourly-value-workspace.service';
import { DerivedHourlyValueWorkspaceRepository } from '../derived-hourly-value-workspace/derived-hourly-value-workspace.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DerivedHourlyValueWorkspaceRepository,
      HourlyOperatingDataWorkspaceRepository,
    ]),
  ],
  providers: [
    DerivedHourlyValueWorkspaceService,
    HourlyOperatingDataWorkspaceService,
  ],
})
export class HourlyOperatingDataWorkspaceModule {}
