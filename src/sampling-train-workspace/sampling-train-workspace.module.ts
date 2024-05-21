import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BulkLoadModule } from '@us-epa-camd/easey-common/bulk-load';

import { SamplingTrainMap } from 'src/maps/sampling-train.map';
import { SamplingTrainWorkspaceRepository } from './sampling-train-workspace.repository';
import { SamplingTrainWorkspaceService } from './sampling-train-workspace.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SamplingTrainWorkspaceRepository]),
    BulkLoadModule,
  ],
  providers: [
    SamplingTrainWorkspaceRepository,
    SamplingTrainWorkspaceService,
    SamplingTrainMap,
  ],
  exports: [
    TypeOrmModule,
    SamplingTrainWorkspaceRepository,
    SamplingTrainMap,
    SamplingTrainWorkspaceService,
  ],
})
export class SamplingTrainWorkspaceModule {}
