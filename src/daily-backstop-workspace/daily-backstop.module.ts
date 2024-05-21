import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BulkLoadModule } from '@us-epa-camd/easey-common/bulk-load';

import { DailyBackstopMap } from '../maps/daily-backstop.map';
import { DailyBackstopWorkspaceRepository } from './daily-backstop.repository';
import { DailyBackstopWorkspaceService } from './daily-backstop.service';

@Module({
  imports: [
    BulkLoadModule,
    TypeOrmModule.forFeature([DailyBackstopWorkspaceRepository]),
  ],
  controllers: [],
  providers: [
    DailyBackstopWorkspaceRepository,
    DailyBackstopWorkspaceService,
    DailyBackstopMap,
  ],
  exports: [
    TypeOrmModule,
    DailyBackstopWorkspaceRepository,
    DailyBackstopWorkspaceService,
    DailyBackstopMap,
  ],
})
export class DailyBackstopWorkspaceModule {}
