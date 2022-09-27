import { Test, TestingModule } from '@nestjs/testing';
import { DailyFuelService } from './daily-fuel.service';

describe('DailyFuelService', () => {
  let service: DailyFuelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailyFuelService],
    }).compile();

    service = module.get<DailyFuelService>(DailyFuelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
