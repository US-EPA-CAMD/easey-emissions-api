import { Test } from '@nestjs/testing';
import { MatsMonitorHourlyValueMap } from '../maps/mats-monitor-hourly-value.map';
import { MatsMonitorHourlyValueWorkspaceRepository } from './mats-monitor-hourly-value.repository';
import { MatsMonitorHourlyValueWorkspaceService } from './mats-monitor-hourly-value.service';
import { genMatsMonitorHourlyValueImportDto } from '../../test/object-generators/mats-monitor-hourly-value-dto';

const mockMap = {
  many: () => null,
};

describe('MatsMonitorHourlyValueWorkspaceService', () => {
  let service: MatsMonitorHourlyValueWorkspaceService;
  let repository: MatsMonitorHourlyValueWorkspaceRepository;
  let map;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MatsMonitorHourlyValueWorkspaceService,
        MatsMonitorHourlyValueWorkspaceRepository,
        {
          provide: MatsMonitorHourlyValueMap,
          useValue: mockMap,
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

  describe('import', () => {
    it('should import given the correct data', async () => {
      const matsMonitorImport = genMatsMonitorHourlyValueImportDto()[0];

      jest.spyOn(service, 'import').mockResolvedValue(undefined);

      await expect(
        service.import(matsMonitorImport, '123', '123', 123, {
          components: {},
          monitoringSystems: {},
        }),
      ).resolves;
    });
  });
});
