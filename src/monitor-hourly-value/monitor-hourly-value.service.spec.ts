import { Test } from '@nestjs/testing';

import { MonitorHourlyValueService } from '../monitor-hourly-value/monitor-hourly-value.service';
import { MonitorHourlyValueMap } from '../maps/monitor-hourly-value.map';
import { MonitorHourlyValueRepository } from '../monitor-hourly-value/monitor-hourly-value.repository';

const mockRepository = {
  export: () => null,
  find: () => null,
};
const mockMap = {
  many: () => null,
};

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
          provide: MonitorHourlyValueRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get(MonitorHourlyValueService);
    repository = module.get(MonitorHourlyValueRepository);
    map = module.get(MonitorHourlyValueMap);
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
