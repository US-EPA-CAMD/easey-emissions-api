import { Test, TestingModule } from '@nestjs/testing';
import { SamplingTrainWorkspaceService } from './sampling-train-workspace.service';
import { SamplingTrainWorkspaceRepository } from './sampling-train-workspace.repository';
import { ComponentRepository } from '../component/component.repository';

describe('SamplingTrainWorkspaceService', () => {
  let service: SamplingTrainWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComponentRepository,
        SamplingTrainWorkspaceService,
        SamplingTrainWorkspaceRepository,
      ],
    }).compile();

    service = module.get<SamplingTrainWorkspaceService>(
      SamplingTrainWorkspaceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
