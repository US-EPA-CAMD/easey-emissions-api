import { Test } from '@nestjs/testing';
import { MatsDerivedHourlyValueMap } from '../maps/mats-derived-hourly-value.map';
import { MatsDerivedHourlyValueWorkspaceService } from './mats-derived-hourly-value.service';
import { MatsDerivedHourlyValueWorkspaceRepository } from './mats-derived-hourly-value.repository';

const mockRepository = {
  export: () => null,
  find: () => null,
};
const mockMap = {
  many: () => null,
};

describe('MatsDerivedHourlyValueWorkspaceService', () => {
  let service: MatsDerivedHourlyValueWorkspaceService;
  let repository: any;
  let map;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MatsDerivedHourlyValueWorkspaceService,
        {
          provide: MatsDerivedHourlyValueMap,
          useValue: mockMap,
        },
        {
          provide: MatsDerivedHourlyValueWorkspaceRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get(MatsDerivedHourlyValueWorkspaceService);
    repository = module.get(MatsDerivedHourlyValueWorkspaceRepository);
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
