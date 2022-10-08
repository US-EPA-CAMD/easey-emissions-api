import { Test, TestingModule } from '@nestjs/testing';
import { Nsps4tSummaryService } from './nsps4t-summary.service';
import { Nsps4tSummaryRepository } from './nsps4t-summary.repository';
import { Nsps4tAnnualRepository } from '../nsps4t-annual/nsps4t-annual.repository';
import { Nsps4tAnnualService } from '../nsps4t-annual/nsps4t-annual.service';
import { Nsps4tCompliancePeriodRepository } from '../nsps4t-compliance-period/nsps4t-compliance-period.repository';
import { Nsps4tCompliancePeriodService } from '../nsps4t-compliance-period/nsps4t-compliance-period.service';

describe('Nsps4tSummaryService', () => {
  let service: Nsps4tSummaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Nsps4tAnnualRepository,
        Nsps4tAnnualService,
        Nsps4tCompliancePeriodRepository,
        Nsps4tCompliancePeriodService,
        Nsps4tSummaryRepository,
        Nsps4tSummaryService,
      ],
    }).compile();

    service = module.get<Nsps4tSummaryService>(Nsps4tSummaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
