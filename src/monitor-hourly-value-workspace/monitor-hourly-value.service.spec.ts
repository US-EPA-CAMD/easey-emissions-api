import { Test } from '@nestjs/testing';

import { MonitorHourlyValueMap } from '../maps/monitor-hourly-value.map';
import { MonitorHourlyValueWorkspaceRepository } from './monitor-hourly-value.repository';
import { MonitorHourlyValueWorkspaceService } from './monitor-hourly-value.service';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { MonitorHourlyValueImportDTO } from '../dto/monitor-hourly-value.dto';

const mockRepository = {
  export: () => null,
  find: () => null,
};
const mockMap = {
  many: () => null,
};

const writeObjectMock = jest.fn();

describe('MonitorHourlyValueWorkspaceService', () => {
  let service: MonitorHourlyValueWorkspaceService;
  let repository: MonitorHourlyValueWorkspaceRepository;
  let map;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MonitorHourlyValueWorkspaceService,
        {
          provide: MonitorHourlyValueMap,
          useValue: mockMap,
        },
        {
          provide: MonitorHourlyValueWorkspaceRepository,
          useValue: mockRepository,
        },
        {
          provide: BulkLoadService,
          useFactory: () => ({
            startBulkLoader: jest.fn().mockResolvedValue({
              writeObject: writeObjectMock,
              complete: jest.fn(),
              finished: true,
            }),
          }),
        },
      ],
    }).compile();

    service = module.get(MonitorHourlyValueWorkspaceService);
    repository = module.get(MonitorHourlyValueWorkspaceRepository);
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
  /*
  describe('import', () => {
    it('should simulate the import of 2 new records', async () => {
      const params = [
        new MonitorHourlyValueImportDTO(),
        new MonitorHourlyValueImportDTO(),
      ];

      await service.import(params, '', '', 1, {
        components: {},
        userId: '',
        monitorFormulas: {},
        monitoringSystems: {},
      });

      expect(writeObjectMock).toHaveBeenCalledTimes(2);
    });
  });
  */
});
