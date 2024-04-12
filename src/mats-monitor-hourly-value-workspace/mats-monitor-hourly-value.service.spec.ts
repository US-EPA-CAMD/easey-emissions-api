import { Test } from '@nestjs/testing';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { EntityManager } from 'typeorm';

import { MatsMonitorHourlyValueMap } from '../maps/mats-monitor-hourly-value.map';
import { MatsMonitorHourlyValueWorkspaceRepository } from './mats-monitor-hourly-value.repository';
import { MatsMonitorHourlyValueWorkspaceService } from './mats-monitor-hourly-value.service';

const mockMap = {
  many: () => null,
};

const writeObjectMock = jest.fn();

describe('MatsMonitorHourlyValueWorkspaceService', () => {
  let service: MatsMonitorHourlyValueWorkspaceService;
  let repository: MatsMonitorHourlyValueWorkspaceRepository;
  let map;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EntityManager,
        MatsMonitorHourlyValueWorkspaceService,
        MatsMonitorHourlyValueWorkspaceRepository,
        {
          provide: MatsMonitorHourlyValueMap,
          useValue: mockMap,
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

    service = module.get(MatsMonitorHourlyValueWorkspaceService);
    repository = module.get(MatsMonitorHourlyValueWorkspaceRepository);
    map = module.get(MatsMonitorHourlyValueMap);
  });

  describe('export', () => {
    it('service should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should export a record', async () => {
      jest.spyOn(repository, 'export').mockResolvedValue(null);

      const result = await service.export(['123']);
      expect(result).toEqual(null);
    });
  });
  /*
  describe('import', () => {
    it('should simulate the import of 2 new records', async () => {
      const params = [
        new MatsMonitorHourlyValueImportDTO(),
        new MatsMonitorHourlyValueImportDTO(),
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
