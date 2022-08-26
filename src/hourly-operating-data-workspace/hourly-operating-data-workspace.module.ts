import { Module } from '@nestjs/common';
import { HourlyOperatingDataWorkspaceService } from './hourly-operating-data-workspace.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HourlyOperatingDataWorkspaceRepository } from './hourly-operating-data-workspace.repository';
import { DerivedHourlyValueWorkspaceService } from '../derived-hourly-value-workspace/derived-hourly-value-workspace.service';
import { DerivedHourlyValueWorkspaceRepository } from '../derived-hourly-value-workspace/derived-hourly-value-workspace.repository';
import { DerivedHourlyValueWorkspaceMap } from '../derived-hourly-value-workspace/derived-hourly-value-workspace.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DerivedHourlyValueWorkspaceRepository,
      HourlyOperatingDataWorkspaceRepository,
    ]),
  ],
  providers: [
    DerivedHourlyValueWorkspaceService,
    DerivedHourlyValueWorkspaceMap,
    HourlyOperatingDataWorkspaceService,
  ],
})
export class HourlyOperatingDataWorkspaceModule {}
