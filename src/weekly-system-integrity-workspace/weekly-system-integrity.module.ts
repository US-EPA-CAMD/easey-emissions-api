import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BulkLoadModule } from '@us-epa-camd/easey-common/bulk-load';

import { WeeklySystemIntegrityMap } from '../maps/weekly-system-integrity.map';
import { WeeklySystemIntegrityWorkspaceRepository } from './weekly-system-integrity.repository';
import { WeeklySystemIntegrityWorkspaceService } from './weekly-system-integrity.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([WeeklySystemIntegrityWorkspaceRepository]),
    BulkLoadModule,
  ],
  providers: [
    WeeklySystemIntegrityMap,
    WeeklySystemIntegrityWorkspaceRepository,
    WeeklySystemIntegrityWorkspaceService,
  ],
  exports: [
    TypeOrmModule,
    WeeklySystemIntegrityMap,
    WeeklySystemIntegrityWorkspaceRepository,
    WeeklySystemIntegrityWorkspaceService,
  ],
})
export class WeeklySystemIntegrityWorkspaceModule {}
