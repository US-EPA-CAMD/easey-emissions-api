import { Module } from '@nestjs/common';
import { SamplingTrainWorkspaceService } from './sampling-train-workspace.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SamplingTrainWorkspaceRepository } from './sampling-train-workspace.repository';
import {
  BulkLoadModule,
  BulkLoadService,
} from '@us-epa-camd/easey-common/bulk-load';
import { SamplingTrainMap } from 'src/maps/sampling-train.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([SamplingTrainWorkspaceRepository]),
    BulkLoadModule,
  ],
  providers: [SamplingTrainWorkspaceService, BulkLoadService, SamplingTrainMap],
  exports: [TypeOrmModule, SamplingTrainMap, BulkLoadService],
})
export class SamplingTrainWorkspaceModule {}
