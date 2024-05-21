import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BulkLoadModule } from '@us-epa-camd/easey-common/bulk-load';

import { SorbentTrapMap } from '../maps/sorbent-trap.map';
import { SamplingTrainWorkspaceModule } from '../sampling-train-workspace/sampling-train-workspace.module';
import { SorbentTrapWorkspaceRepository } from './sorbent-trap-workspace.repository';
import { SorbentTrapWorkspaceService } from './sorbent-trap-workspace.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SorbentTrapWorkspaceRepository]),
    BulkLoadModule,
    SamplingTrainWorkspaceModule,
  ],
  providers: [
    SorbentTrapMap,
    SorbentTrapWorkspaceRepository,
    SorbentTrapWorkspaceService,
  ],
  exports: [
    TypeOrmModule,
    SorbentTrapWorkspaceRepository,
    SorbentTrapMap,
    SorbentTrapWorkspaceService,
  ],
})
export class SorbentTrapWorkspaceModule {}
