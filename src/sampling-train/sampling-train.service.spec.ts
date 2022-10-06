import { Test, TestingModule } from '@nestjs/testing';
import { SamplingTrainService } from './sampling-train.service';
import { SamplingTrainRepository } from './sampling-train.repository';

describe('SamplingTrainService', () => {
  let service: SamplingTrainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SamplingTrainService, SamplingTrainRepository],
    }).compile();

    service = module.get<SamplingTrainService>(SamplingTrainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
