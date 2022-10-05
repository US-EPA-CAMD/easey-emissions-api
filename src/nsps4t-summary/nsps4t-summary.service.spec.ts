import { Test, TestingModule } from '@nestjs/testing';
import { Nsps4tSummaryService } from './nsps4t-summary.service';

describe('Nsps4tSummaryService', () => {
  let service: Nsps4tSummaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Nsps4tSummaryService],
    }).compile();

    service = module.get<Nsps4tSummaryService>(Nsps4tSummaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
