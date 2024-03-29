import { Test, TestingModule } from '@nestjs/testing';
import { Nsps4tCompliancePeriodService } from './nsps4t-compliance-period.service';
import { Nsps4tCompliancePeriodRepository } from './nsps4t-compliance-period.repository';

describe('Nsps4tCompliancePeriodService', () => {
  let service: Nsps4tCompliancePeriodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Nsps4tCompliancePeriodRepository,
        Nsps4tCompliancePeriodService,
      ],
    }).compile();

    service = module.get<Nsps4tCompliancePeriodService>(
      Nsps4tCompliancePeriodService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
