import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, EntityManager } from 'typeorm';

import { Nsps4tAnnualRepository } from './nsps4t-annual.repository';
import { Nsps4tAnnualService } from './nsps4t-annual.service';

describe('Nsps4tAnnualService', () => {
  let service: Nsps4tAnnualService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntityManager, Nsps4tAnnualRepository, Nsps4tAnnualService,
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

    service = module.get<Nsps4tAnnualService>(Nsps4tAnnualService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
