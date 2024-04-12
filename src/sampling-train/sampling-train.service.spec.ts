import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';

import { SamplingTrainRepository } from './sampling-train.repository';
import { SamplingTrainService } from './sampling-train.service';

describe('SamplingTrainService', () => {
  let service: SamplingTrainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntityManager, SamplingTrainService, SamplingTrainRepository],
    }).compile();

    service = module.get<SamplingTrainService>(SamplingTrainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
