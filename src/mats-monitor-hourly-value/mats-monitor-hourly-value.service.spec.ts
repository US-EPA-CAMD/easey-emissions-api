import { Test } from '@nestjs/testing';
import { MatsMonitorHourlyValueMap } from '../maps/mats-monitor-hourly-value.map';
import { MatsMonitorHourlyValueRepository } from './mats-monitor-hourly-value.repository';
import { MatsMonitorHourlyValueService } from './mats-monitor-hourly-value.service';

const mockRepository = {
  export: () => null,
  find: () => null,
};
const mockMap = {
  many: () => null,
};

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
          provide: MatsMonitorHourlyValueRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get(MatsMonitorHourlyValueService);
    repository = module.get(MatsMonitorHourlyValueRepository);
    map = module.get(MatsMonitorHourlyValueMap);
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
