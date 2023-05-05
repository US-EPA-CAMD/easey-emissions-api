import { Module } from '@nestjs/common';
import { SorbentTrapWorkspaceService } from './sorbent-trap-workspace.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SorbentTrapWorkspaceRepository } from './sorbent-trap-workspace.repository';
import { SamplingTrainWorkspaceService } from '../sampling-train-workspace/sampling-train-workspace.service';
import { SamplingTrainWorkspaceRepository } from '../sampling-train-workspace/sampling-train-workspace.repository';
import {
  BulkLoadModule,
  BulkLoadService,
} from '@us-epa-camd/easey-common/bulk-load';
import { SorbentTrapMap } from 'src/maps/sorbent-trap.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SamplingTrainWorkspaceRepository,
      SorbentTrapWorkspaceRepository,
    ]),
    BulkLoadModule,
  ],
  providers: [
    SamplingTrainWorkspaceService,
    SorbentTrapWorkspaceService,
    BulkLoadService,
    SorbentTrapMap,
  ],
  exports: [
    TypeOrmModule,
    SorbentTrapMap,
    BulkLoadService,
  ],
})
export class SorbentTrapWorkspaceModule {}
