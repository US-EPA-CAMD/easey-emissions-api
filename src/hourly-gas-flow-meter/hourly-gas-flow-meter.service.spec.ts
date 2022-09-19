import { HourlyGasFlowMeterRepository } from './hourly-gas-flow-meter.repository';
import { Test } from '@nestjs/testing';
import { HourlyGasFlowMeterMap } from '../maps/hourly-gas-flow-meter.map';
import { HourlyGasFlowMeterService } from '../hourly-gas-flow-meter/hourly-gas-flow-meter.service';
import { mockHourlyGasFlowMeterRepository } from '../../test/mocks/mock-hourly-gas-flow-meter-repository';
import { genHourlyGasFlowMeter } from '../../test/object-generators/hourly-gas-flow-meter';
import { HrlyGasFlowMeter } from '../entities/workspace/hrly-gas-flow-meter.entity';

describe('--HourlyGasFlowMeterService--', () => {
  let map: HourlyGasFlowMeterMap;
  let repository: HourlyGasFlowMeterRepository;
  let service: HourlyGasFlowMeterService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        HourlyGasFlowMeterMap,
        HourlyGasFlowMeterService,
        {
          provide: HourlyGasFlowMeterRepository,
          useValue: mockHourlyGasFlowMeterRepository,
        },
      ],
    }).compile();

    map = module.get(HourlyGasFlowMeterMap);
    repository = module.get(HourlyGasFlowMeterRepository);
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

      await expect(
        service.export(
          mockedValues.map(value => {
            return value.hourId;
          }),
        ),
      ).resolves.toEqual(mappedValues);
    });
  });
});
