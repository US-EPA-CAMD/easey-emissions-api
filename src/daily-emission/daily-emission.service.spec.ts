import { Test, TestingModule } from '@nestjs/testing';
import { DailyEmissionService } from './daily-emission.service';

describe('DailyEmissionDataService', () => {
  let service: DailyEmissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailyEmissionService],
    }).compile();

    service = module.get<DailyEmissionService>(DailyEmissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
