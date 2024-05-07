import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';

import { WeeklySystemIntegrityMap } from '../maps/weekly-system-integrity.map';
import { WeeklySystemIntegrityWorkspaceRepository } from './weekly-system-integrity.repository';
import { WeeklySystemIntegrityWorkspaceService } from './weekly-system-integrity.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([WeeklySystemIntegrityWorkspaceRepository]),
    BulkLoadService,
  ],
  providers: [
    WeeklySystemIntegrityMap,
    WeeklySystemIntegrityWorkspaceRepository,
    WeeklySystemIntegrityWorkspaceService,
    BulkLoadService,
  ],
  exports: [
    TypeOrmModule,
    WeeklySystemIntegrityMap,
    WeeklySystemIntegrityWorkspaceService,
    BulkLoadService,
  ],
})
export class WeeklySystemIntegrityWorkspaceModule {}
