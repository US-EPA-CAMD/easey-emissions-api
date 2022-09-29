import { Test, TestingModule } from '@nestjs/testing';
import { SorbentTrapWorkspaceService } from './sorbent-trap-workspace.service';
import { SamplingTrainWorkspaceService } from '../sampling-train-workspace/sampling-train-workspace.service';
import { SamplingTrainWorkspaceRepository } from '../sampling-train-workspace/sampling-train-workspace.repository';
import { SorbentTrapWorkspaceRepository } from './sorbent-trap-workspace.repository';

describe('SorbentTrapWorkspaceService', () => {
  let service: SorbentTrapWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SamplingTrainWorkspaceService,
        SorbentTrapWorkspaceService,
        SamplingTrainWorkspaceRepository,
        SorbentTrapWorkspaceRepository,
      ],
    }).compile();

    service = module.get<SorbentTrapWorkspaceService>(
      SorbentTrapWorkspaceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
