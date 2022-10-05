import { Test, TestingModule } from '@nestjs/testing';
import { Nsps4tCompliancePeriodWorkspaceService } from './nsps4t-compliance-period-workspace.service';
import { Nsps4tCompliancePeriodWorkspaceRepository } from './nsps4t-compliance-period-workspace.repository';

describe('Nsps4tCompliancePeriodWorkspaceService', () => {
  let service: Nsps4tCompliancePeriodWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Nsps4tCompliancePeriodWorkspaceService,
        Nsps4tCompliancePeriodWorkspaceRepository,
      ],
    }).compile();

    service = module.get<Nsps4tCompliancePeriodWorkspaceService>(
      Nsps4tCompliancePeriodWorkspaceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
