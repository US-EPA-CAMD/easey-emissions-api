import { Test } from '@nestjs/testing';

import { HourlyOperatingRepository } from './hourly-operating.repository';
import { HourlyOperatingService } from './hourly-operating.service';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import { MonitorHourlyValueService } from '../monitor-hourly-value/monitor-hourly-value.service';
import { MonitorHourlyValueMap } from '../maps/monitor-hourly-value.map';
import { MonitorHourlyValueRepository } from '../monitor-hourly-value/monitor-hourly-value.repository';
import { MatsMonitorHourlyValueService } from '../mats-monitor-hourly-value/mats-monitor-hourly-value.service';
import { MatsMonitorHourlyValueRepository } from '../mats-monitor-hourly-value/mats-monitor-hourly-value.repository';
import { MatsMonitorHourlyValueMap } from '../maps/mats-monitor-hourly-value.map';

const mockRepository = {
  export: () => null,
};
const mockMap = {
  many: () => null,
};

describe('HourlyOperatingService', () => {
  let service: HourlyOperatingService;
  let repository: any;
  let map;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        HourlyOperatingService,
        MonitorHourlyValueService,
        MonitorHourlyValueRepository,
        MonitorHourlyValueMap,
        MatsMonitorHourlyValueService,
        MatsMonitorHourlyValueRepository,
        MatsMonitorHourlyValueMap,
        {
          provide: HourlyOperatingMap,
          useValue: mockMap,
        },
        {
          provide: HourlyOperatingRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get(HourlyOperatingService);
    repository = module.get(HourlyOperatingRepository);
    map = module.get(HourlyOperatingMap);
  });

  describe('export', () => {
    it('service should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should export a record', async () => {
      const filters = new EmissionsParamsDTO();
      const result = await service.export(['123'], filters);
      expect(result).toEqual(null);
    });
  });
});
