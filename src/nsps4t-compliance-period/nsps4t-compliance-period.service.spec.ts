import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, EntityManager } from 'typeorm';

import { Nsps4tCompliancePeriodRepository } from './nsps4t-compliance-period.repository';
import { Nsps4tCompliancePeriodService } from './nsps4t-compliance-period.service';

describe('Nsps4tCompliancePeriodService', () => {
  let service: Nsps4tCompliancePeriodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EntityManager,
        Nsps4tCompliancePeriodRepository,
        Nsps4tCompliancePeriodService,
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
              isReleased: false,
            }),
          },
        }
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
