import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, EntityManager } from 'typeorm';

import { SamplingTrainRepository } from './sampling-train.repository';
import { SamplingTrainService } from './sampling-train.service';

describe('SamplingTrainService', () => {
  let service: SamplingTrainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntityManager, SamplingTrainService, SamplingTrainRepository,
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

    service = module.get<SamplingTrainService>(SamplingTrainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
