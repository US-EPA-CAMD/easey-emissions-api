import { Test, TestingModule } from '@nestjs/testing';
import { HourlyOperatingDataService } from './hourly-operating-data.service';
import { HourlyOperatingDataRepository } from './hourly-operating-data.repository';
import { DerivedHourlyValueService } from '../derived-hourly-value/derived-hourly-value.service';
import { DerivedHourlyValueRepository } from '../derived-hourly-value/derived-hourly-value.repository';

describe('HourlyOperatingDataService', () => {
  let service: HourlyOperatingDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DerivedHourlyValueService,
        HourlyOperatingDataService,
        { provide: HourlyOperatingDataRepository, useValue: () => jest },
        { provide: DerivedHourlyValueRepository, useValue: () => jest },
      ],
    }).compile();

    service = module.get<HourlyOperatingDataService>(
      HourlyOperatingDataService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
