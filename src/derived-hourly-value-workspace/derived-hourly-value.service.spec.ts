import { Test, TestingModule } from '@nestjs/testing';
import { DerivedHourlyValueService } from './derived-hourly-value.service';
import { DerivedHourlyValueRepository } from './derived-hourly-value.repository';

const derivedHourlyValueRepositoryMock = {
  export: () => null,
};

describe('DerivedHourlyValueService', () => {
  let service: DerivedHourlyValueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DerivedHourlyValueService,
        {
          provide: DerivedHourlyValueRepository,
          useValue: derivedHourlyValueRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<DerivedHourlyValueService>(DerivedHourlyValueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should export a record', async () => {
    await expect(service.export(['123'])).resolves.toEqual(null);
  });
});
