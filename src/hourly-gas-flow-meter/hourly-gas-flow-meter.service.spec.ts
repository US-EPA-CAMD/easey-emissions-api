import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { HourlyGasFlowMeterMap } from '../maps/hourly-gas-flow-meter.map';
import { HourlyGasFlowMeterService } from './hourly-gas-flow-meter.service';
import { mockHourlyGasFlowMeterRepository } from '../../test/mocks/mock-hourly-gas-flow-meter-repository';
import { genHourlyGasFlowMeter } from '../../test/object-generators/hourly-gas-flow-meter';
import { HrlyGasFlowMeter } from '../entities/hrly-gas-flow-meter.entity';

jest.mock('./hourly-gas-flow-meter.repository', () => ({
  HourlyGasFlowMeterRepository: jest.fn().mockImplementation(() => mockHourlyGasFlowMeterRepository),
}));

describe('--HourlyGasFlowMeterService--', () => {
  let map: HourlyGasFlowMeterMap;
  let repository: any;
  let service: HourlyGasFlowMeterService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        HourlyGasFlowMeterMap,
        HourlyGasFlowMeterService,
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
              manager: {},
            }),
          },
        }
      ],
    }).compile();

    map = module.get(HourlyGasFlowMeterMap);
    repository = mockHourlyGasFlowMeterRepository;
    service = module.get(HourlyGasFlowMeterService);
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

      await expect(service.export(123, ['123'])).resolves.toEqual(mappedValues);
    });
  });
});
