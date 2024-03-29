import { Test } from '@nestjs/testing';
import { HourlyGasFlowMeterMap } from '../maps/hourly-gas-flow-meter.map';
import { genHourlyGasFlowMeter } from '../../test/object-generators/hourly-gas-flow-meter';
import { HrlyGasFlowMeter } from '../entities/workspace/hrly-gas-flow-meter.entity';
import { HourlyGasFlowMeterWorkspaceRepository } from './hourly-gas-flow-meter.repository';
import { HourlyGasFlowMeterWorkspaceService } from './hourly-gas-flow-meter.service';
import { mockHourlyGasFlowMeterWorkspaceRepository } from '../../test/mocks/mock-hourly-gas-flow-meter-workspace-repository';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { HourlyGasFlowMeterImportDTO } from '../dto/hourly-gas-flow-meter.dto';

const writeObjectMock = jest.fn();

describe('--HourlyGasFlowMeterService--', () => {
  let map: HourlyGasFlowMeterMap;
  let repository: HourlyGasFlowMeterWorkspaceRepository;
  let service: HourlyGasFlowMeterWorkspaceService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        HourlyGasFlowMeterMap,
        HourlyGasFlowMeterWorkspaceService,
        {
          provide: HourlyGasFlowMeterWorkspaceRepository,
          useValue: mockHourlyGasFlowMeterWorkspaceRepository,
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

    map = module.get(HourlyGasFlowMeterMap);
    repository = module.get(HourlyGasFlowMeterWorkspaceRepository);
    service = module.get(HourlyGasFlowMeterWorkspaceService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('export', () => {
    it('returns export record for hourly gas flow meter data', async () => {
      const mockedValues = genHourlyGasFlowMeter<HrlyGasFlowMeter>(3, {
        include: ['component'],
      });
      const promises = [];
      mockedValues.forEach(value => {
        promises.push(map.one(value));
      });
      const mappedValues = await Promise.all(promises);
      jest.spyOn(repository, 'export').mockResolvedValue(mockedValues);

      await expect(
        service.export(
          mockedValues.map(value => {
            return value.hourId;
          }),
        ),
      ).resolves.toEqual(mappedValues);
    });
  });
  /*
  describe('import', () => {
    it('should simulate the import of 2 new records', async () => {
      const params = [
        new HourlyGasFlowMeterImportDTO(),
        new HourlyGasFlowMeterImportDTO(),
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
