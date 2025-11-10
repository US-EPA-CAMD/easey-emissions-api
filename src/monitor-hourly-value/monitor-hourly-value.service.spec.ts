import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { MonitorHourlyValueService } from '../monitor-hourly-value/monitor-hourly-value.service';
import { MonitorHourlyValueMap } from '../maps/monitor-hourly-value.map';

const mockRepository = {
  export: jest.fn(),
  find: jest.fn(),
};
const mockMap = {
  many: () => null,
};

jest.mock('../monitor-hourly-value/monitor-hourly-value.repository', () => ({
  MonitorHourlyValueRepository: jest.fn().mockImplementation(() => mockRepository),
}));

describe('MonitorHourlyValueService', () => {
  let service: MonitorHourlyValueService;
  let repository: any;
  let map;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MonitorHourlyValueService,
        {
          provide: MonitorHourlyValueMap,
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

    service = module.get(MonitorHourlyValueService);
    repository = mockRepository;
    map = module.get(MonitorHourlyValueMap);
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
