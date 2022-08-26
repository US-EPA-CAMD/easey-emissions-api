import { Test } from '@nestjs/testing';
import { MatsMonitorHourlyValueMap } from '../maps/mats-monitor-hourly-value.map';
import { MatsMonitorHourlyValueWorkspaceRepository } from './mats-monitor-hourly-value.repository';
import { MatsMonitorHourlyValueWorkspaceService } from './mats-monitor-hourly-value.service';

const mockRepository = {
  export: () => null,
  find: () => null,
};
const mockMap = {
  many: () => null,
};

describe('MatsMonitorHourlyValueWorkspaceService', () => {
  let service: MatsMonitorHourlyValueWorkspaceService;
  let repository: any;
  let map;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MatsMonitorHourlyValueWorkspaceService,
        {
          provide: MatsMonitorHourlyValueMap,
          useValue: mockMap,
        },
        {
          provide: MatsMonitorHourlyValueWorkspaceRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get(MatsMonitorHourlyValueWorkspaceService);
    repository = module.get(MatsMonitorHourlyValueWorkspaceRepository);
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
