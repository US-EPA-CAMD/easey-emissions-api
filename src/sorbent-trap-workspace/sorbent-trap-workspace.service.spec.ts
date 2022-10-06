import { Test, TestingModule } from '@nestjs/testing';
import { SorbentTrapWorkspaceService } from './sorbent-trap-workspace.service';
import { SamplingTrainWorkspaceService } from '../sampling-train-workspace/sampling-train-workspace.service';
import { SamplingTrainWorkspaceRepository } from '../sampling-train-workspace/sampling-train-workspace.repository';
import { SorbentTrapWorkspaceRepository } from './sorbent-trap-workspace.repository';
import { ComponentRepository } from '../component/component.repository';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';

describe('SorbentTrapWorkspaceService', () => {
  let service: SorbentTrapWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComponentRepository,
        MonitorSystemRepository,
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
