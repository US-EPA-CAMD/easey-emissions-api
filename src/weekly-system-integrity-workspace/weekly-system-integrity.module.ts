import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WeeklySystemIntegrityMap } from '../maps/weekly-system-integrity.map';
import { WeeklySystemIntegrityWorkspaceService } from './weekly-system-integrity.service';
import { WeeklySystemIntegrityWorkspaceRepository } from './weekly-system-integrity.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([WeeklySystemIntegrityWorkspaceRepository]),
  ],
  providers: [WeeklySystemIntegrityMap, WeeklySystemIntegrityWorkspaceService],
  exports: [
    TypeOrmModule,
    WeeklySystemIntegrityMap,
    WeeklySystemIntegrityWorkspaceService,
  ],
})
export class WeeklySystemIntegrityWorkspaceModule {}
