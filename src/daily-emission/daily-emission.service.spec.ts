import { Test, TestingModule } from '@nestjs/testing';
import { DailyEmissionService } from './daily-emission.service';
import { DailyEmissionRepository } from './daily-emission.repository';
import { DailyFuelService } from '../daily-fuel/daily-fuel.service';
import { DailyFuelRepository } from '../daily-fuel/daily-fuel.repository';

describe('DailyEmissionDataService', () => {
  let service: DailyEmissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DailyEmissionService,
        DailyEmissionRepository,
        DailyFuelService,
        DailyFuelRepository,
      ],
    }).compile();

    service = module.get<DailyEmissionService>(DailyEmissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
