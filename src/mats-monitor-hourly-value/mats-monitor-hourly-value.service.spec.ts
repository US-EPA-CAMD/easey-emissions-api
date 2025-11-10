import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { MatsMonitorHourlyValueMap } from '../maps/mats-monitor-hourly-value.map';
import { MatsMonitorHourlyValueService } from './mats-monitor-hourly-value.service';

const mockRepository = {
  export: jest.fn(),
  find: jest.fn(),
};
const mockMap = {
  many: () => null,
};
jest.mock('./mats-monitor-hourly-value.repository', () => ({
  MatsMonitorHourlyValueRepository: jest.fn().mockImplementation(() => mockRepository),
}));

describe('MatsMonitorHourlyValueService', () => {
  let service: MatsMonitorHourlyValueService;
  let repository: any;
  let map;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MatsMonitorHourlyValueService,
        {
          provide: MatsMonitorHourlyValueMap,
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

    service = module.get(MatsMonitorHourlyValueService);
    repository = mockRepository;
    map = module.get(MatsMonitorHourlyValueMap);
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
