import { Test, TestingModule } from '@nestjs/testing';
import { DerivedHourlyValueService } from './derived-hourly-value.service';
import { DerivedHourlyValueRepository } from './derived-hourly-value.repository';
import { DerivedHourlyValueMap } from '../maps/derived-hourly-value.map';

describe('DerivedHourlyValueService', () => {
  let service: DerivedHourlyValueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DerivedHourlyValueMap,
        DerivedHourlyValueService,
        { provide: DerivedHourlyValueRepository, useValue: () => jest },
      ],
    }).compile();

    service = module.get<DerivedHourlyValueService>(DerivedHourlyValueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
