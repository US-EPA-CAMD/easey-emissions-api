import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  BulkLoadModule,
  BulkLoadService,
} from '@us-epa-camd/easey-common/bulk-load';

import { SorbentTrapMap } from 'src/maps/sorbent-trap.map';
import { SamplingTrainWorkspaceRepository } from '../sampling-train-workspace/sampling-train-workspace.repository';
import { SamplingTrainWorkspaceService } from '../sampling-train-workspace/sampling-train-workspace.service';
import { SorbentTrapWorkspaceRepository } from './sorbent-trap-workspace.repository';
import { SorbentTrapWorkspaceService } from './sorbent-trap-workspace.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SamplingTrainWorkspaceRepository,
      SorbentTrapWorkspaceRepository,
    ]),
    BulkLoadModule,
  ],
  providers: [
    BulkLoadService,
    SamplingTrainWorkspaceRepository,
    SamplingTrainWorkspaceService,
    SorbentTrapMap,
    SorbentTrapWorkspaceRepository,
    SorbentTrapWorkspaceService,
  ],
  exports: [TypeOrmModule, SorbentTrapMap, BulkLoadService],
})
export class SorbentTrapWorkspaceModule {}
