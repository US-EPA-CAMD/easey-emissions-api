import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WeeklySystemIntegrityMap } from '../maps/weekly-system-integrity.map';
import { WeeklySystemIntegrityWorkspaceService } from './weekly-system-integrity.service';
import { WeeklySystemIntegrityWorkspaceRepository } from './weekly-system-integrity.repository';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';

@Module({
  imports: [
    TypeOrmModule.forFeature([WeeklySystemIntegrityWorkspaceRepository]),
    BulkLoadService,
  ],
  providers: [
    WeeklySystemIntegrityMap,
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
