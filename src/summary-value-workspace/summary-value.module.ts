import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SummaryValueMap } from '../maps/summary-value.map';
import { SummaryValueWorkspaceRepository } from './summary-value.repository';
import { SummaryValueWorkspaceService } from './summary-value.service';
import { BulkLoadModule } from '@us-epa-camd/easey-common/bulk-load';

@Module({
  imports: [
    TypeOrmModule.forFeature([SummaryValueWorkspaceRepository]),
    BulkLoadModule,
  ],
  controllers: [],
  providers: [SummaryValueWorkspaceService, SummaryValueMap],
  exports: [TypeOrmModule, SummaryValueWorkspaceService, SummaryValueMap],
})
export class SummaryValueWorkspaceModule {}
