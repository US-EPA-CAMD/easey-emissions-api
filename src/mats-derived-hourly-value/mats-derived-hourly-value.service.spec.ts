import { Test } from '@nestjs/testing';
import { MatsDerivedHourlyValueMap } from '../maps/mats-derived-hourly-value.map';
import { MatsDerivedHourlyValueService } from './mats-derived-hourly-value.service';
import { MatsDerivedHourlyValueRepository } from './mats-derived-hourly-value.repository';

const mockRepository = {
  export: () => null,
  find: () => null,
};
const mockMap = {
  many: () => null,
};

describe('MatsDerivedHourlyValueService', () => {
  let service: MatsDerivedHourlyValueService;
  let repository: any;
  let map;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MatsDerivedHourlyValueService,
        {
          provide: MatsDerivedHourlyValueMap,
          useValue: mockMap,
        },
        {
          provide: MatsDerivedHourlyValueRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get(MatsDerivedHourlyValueService);
    repository = module.get(MatsDerivedHourlyValueRepository);
    map = module.get(MatsDerivedHourlyValueMap);
  });

  describe('export', () => {
    it('service should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should export a record', async () => {
      const result = await service.export(['123']);
      expect(result).toEqual(null);
    });
  });
});
