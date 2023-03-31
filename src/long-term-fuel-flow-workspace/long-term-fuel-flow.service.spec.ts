import { Test } from '@nestjs/testing';
import { mockLongTermFuelFlowWorkspaceRepository } from '../../test/mocks/mock-long-term-fuel-flow-workspace-repository';
import { LongTermFuelFlowWorkspaceRepository } from './long-term-fuel-flow.repository';
import { LongTermFuelFlowWorkspaceService } from './long-term-fuel-flow.service';

describe('--LongTermFuelFlowWorkspaceService--', () => {
  let repository: LongTermFuelFlowWorkspaceRepository;
  let service: LongTermFuelFlowWorkspaceService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LongTermFuelFlowWorkspaceService,
        {
          provide: LongTermFuelFlowWorkspaceRepository,
          useValue: mockLongTermFuelFlowWorkspaceRepository,
        },
      ],
    }).compile();

    repository = module.get(LongTermFuelFlowWorkspaceRepository);
    service = module.get(LongTermFuelFlowWorkspaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
