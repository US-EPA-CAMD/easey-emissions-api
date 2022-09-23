import { Test } from '@nestjs/testing';
import { genMonitorHourlyValueImportDto } from '../../test/object-generators/montior-hourly-value-dto';

import { MonitorHourlyValueMap } from '../maps/monitor-hourly-value.map';
import { MonitorHourlyValueWorkspaceRepository } from './monitor-hourly-value.repository';
import { MonitorHourlyValueWorkspaceService } from './monitor-hourly-value.service';

const mockRepository = {
  export: () => null,
  find: () => null,
};
const mockMap = {
  many: () => null,
};

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

  describe('import', () => {
    it('should import record', async () => {
      const monitorImport = genMonitorHourlyValueImportDto()[0];

      jest.spyOn(service, 'import').mockResolvedValue(undefined);

      await expect(
        service.import(monitorImport, '12345', '123', 150, {
          components: {},
          monitoringSystems: {},
        }),
      ).resolves;
    });
  });
});
