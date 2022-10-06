import { Module } from '@nestjs/common';
import { SamplingTrainWorkspaceService } from './sampling-train-workspace.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SamplingTrainWorkspaceRepository } from './sampling-train-workspace.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SamplingTrainWorkspaceRepository])],
  providers: [SamplingTrainWorkspaceService],
})
export class SamplingTrainWorkspaceModule {}
