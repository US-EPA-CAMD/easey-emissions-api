import { Test, TestingModule } from '@nestjs/testing';
import { Nsps4tSummaryWorkspaceService } from './nsps4t-summary-workspace.service';
import { Nsps4tSummaryWorkspaceRepository } from './nsps4t-summary-workspace.repository';
import { Nsps4tAnnualWorkspaceService } from '../nsps4t-annual-workspace/nsps4t-annual-workspace.service';
import { Nsps4tAnnualWorkspaceRepository } from '../nsps4t-annual-workspace/nsps4t-annual-workspace.repository';
import { Nsps4tCompliancePeriodWorkspaceService } from '../nsps4t-compliance-period-workspace/nsps4t-compliance-period-workspace.service';
import { Nsps4tCompliancePeriodWorkspaceRepository } from '../nsps4t-compliance-period-workspace/nsps4t-compliance-period-workspace.repository';

describe('Nsps4tSummaryWorkspaceNewService', () => {
  let service: Nsps4tSummaryWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Nsps4tAnnualWorkspaceRepository,
        Nsps4tAnnualWorkspaceService,
        Nsps4tCompliancePeriodWorkspaceRepository,
        Nsps4tCompliancePeriodWorkspaceService,
        Nsps4tSummaryWorkspaceRepository,
        Nsps4tSummaryWorkspaceService,
      ],
    }).compile();

    service = module.get<Nsps4tSummaryWorkspaceService>(
      Nsps4tSummaryWorkspaceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
