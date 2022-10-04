import { Test, TestingModule } from '@nestjs/testing';
import { SorbentTrapService } from './sorbent-trap.service';
import { SorbentTrapRepository } from './sorbent-trap.repository';
import { SamplingTrainService } from '../sampling-train/sampling-train.service';
import { SamplingTrainRepository } from '../sampling-train/sampling-train.repository';

describe('SorbentTrapService', () => {
  let service: SorbentTrapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SamplingTrainService,
        SamplingTrainRepository,
        SorbentTrapService,
        SorbentTrapRepository,
      ],
    }).compile();

    service = module.get<SorbentTrapService>(SorbentTrapService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
