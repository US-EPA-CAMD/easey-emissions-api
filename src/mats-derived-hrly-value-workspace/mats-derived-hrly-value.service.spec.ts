import { Test, TestingModule } from '@nestjs/testing';
import { MatsDerivedHrlyValueService } from './mats-derived-hrly-value.service';
import { MatsDerivedHrlyValueRepository } from './mats-derived-hrly-value.repository';

const matsDerivedHrlyValueRepositoryMock = {
  export: () => null,
};

describe('MatsDerivedHrlyValueService', () => {
  let service: MatsDerivedHrlyValueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatsDerivedHrlyValueService,
        {
          provide: MatsDerivedHrlyValueRepository,
          useValue: matsDerivedHrlyValueRepositoryMock,
        },
      ],
    }).compile();

    service = module.get(MatsDerivedHrlyValueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should export a record', async function() {
    await expect(service.export(['123'])).resolves.toEqual(null);
  });
});
