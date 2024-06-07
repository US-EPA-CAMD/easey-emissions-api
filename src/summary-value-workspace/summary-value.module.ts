import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BulkLoadModule } from '@us-epa-camd/easey-common/bulk-load';

import { SummaryValueMap } from '../maps/summary-value.map';
import { SummaryValueWorkspaceRepository } from './summary-value.repository';
import { SummaryValueWorkspaceService } from './summary-value.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SummaryValueWorkspaceRepository]),
    BulkLoadModule,
  ],
  controllers: [],
  providers: [
    SummaryValueWorkspaceRepository,
    SummaryValueWorkspaceService,
    SummaryValueMap,
  ],
  exports: [
    TypeOrmModule,
    SummaryValueWorkspaceRepository,
    SummaryValueWorkspaceService,
    SummaryValueMap,
  ],
})
export class SummaryValueWorkspaceModule {}
