import { Test, TestingModule } from '@nestjs/testing';
import { HourlyFuelFlowWorkspaceService } from './hourly-fuel-flow-workspace.service';

describe('HourlyFuelFlowService Workspace', () => {
  let service: HourlyFuelFlowWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HourlyFuelFlowWorkspaceService],
    }).compile();

    service = module.get<HourlyFuelFlowWorkspaceService>(
      HourlyFuelFlowWorkspaceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
