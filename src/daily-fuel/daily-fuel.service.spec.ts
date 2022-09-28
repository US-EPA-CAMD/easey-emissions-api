import { Test, TestingModule } from '@nestjs/testing';
import { DailyFuelService } from './daily-fuel.service';
import { DailyFuelRepository } from './daily-fuel.repository';

describe('DailyFuelService', () => {
  let service: DailyFuelService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailyFuelService, DailyFuelRepository],
    }).compile();

    service = module.get<DailyFuelService>(DailyFuelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
