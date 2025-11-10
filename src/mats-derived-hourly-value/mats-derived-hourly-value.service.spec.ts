import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { MatsDerivedHourlyValueMap } from '../maps/mats-derived-hourly-value.map';
import { MatsDerivedHourlyValueService } from './mats-derived-hourly-value.service';

const mockRepository = {
  export: jest.fn(),
  find: null,
};
const mockMap = {
  many: () => null,
};

jest.mock('./mats-derived-hourly-value.repository', () => ({
  MatsDerivedHourlyValueRepository: jest.fn().mockImplementation(() => mockRepository),
}));

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
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
              isReleased: false,
            }),
          },
        }
      ],
    }).compile();

    service = module.get(MatsDerivedHourlyValueService);
    repository = mockRepository;
    map = module.get(MatsDerivedHourlyValueMap);
  });

  describe('export', () => {
    it('service should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should export a record', async () => {
      const result = await service.export(123, ['123']);
      expect(result).toEqual(null);
    });
  });
});
