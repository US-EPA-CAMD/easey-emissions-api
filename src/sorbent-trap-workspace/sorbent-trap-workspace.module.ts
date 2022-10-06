import { Module } from '@nestjs/common';
import { SorbentTrapWorkspaceService } from './sorbent-trap-workspace.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SorbentTrapWorkspaceRepository } from './sorbent-trap-workspace.repository';
import { SamplingTrainWorkspaceService } from '../sampling-train-workspace/sampling-train-workspace.service';
import { SamplingTrainWorkspaceRepository } from '../sampling-train-workspace/sampling-train-workspace.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SamplingTrainWorkspaceRepository,
      SorbentTrapWorkspaceRepository,
    ]),
  ],
  providers: [SamplingTrainWorkspaceService, SorbentTrapWorkspaceService],
})
export class SorbentTrapWorkspaceModule {}
