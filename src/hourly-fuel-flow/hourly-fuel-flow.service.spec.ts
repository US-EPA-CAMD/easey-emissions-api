import { Test, TestingModule } from '@nestjs/testing';
import { HourlyFuelFlowService } from './hourly-fuel-flow.service';
import { HourlyFuelFlowRepository } from './hourly-fuel-flow.repository';
import { HourlyFuelFlowMap } from '../maps/hourly-fuel-flow-map';
import { HourlyParameterFuelFlowService } from '../hourly-parameter-fuel-flow/hourly-parameter-fuel-flow.service';
import { HourlyParameterFuelFlowMap } from '../maps/hourly-parameter-fuel-flow.map';
import { genHourlyFuelFlow } from '../../test/object-generators/hourly-fuel-flow';
import { HrlyFuelFlow } from '../entities/hrly-fuel-flow.entity';
import { mockHourlyFuelFlowRepository } from '../../test/mocks/mock-hourly-fuel-flow-repository';

describe('HourlyFuelFlowService', () => {
  let service: HourlyFuelFlowService;
  let map: HourlyFuelFlowMap;
  let repository: HourlyFuelFlowRepository;

  const mockHourlyParamFuelFlowService = {
    export: () => Promise.resolve([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HourlyFuelFlowService,
        HourlyFuelFlowMap,
        {
          provide: HourlyParameterFuelFlowService,
          useValue: mockHourlyParamFuelFlowService,
        },
        HourlyParameterFuelFlowMap,
        {
          provide: HourlyFuelFlowRepository,
          useValue: mockHourlyFuelFlowRepository,
        },
      ],
    }).compile();

    service = module.get(HourlyFuelFlowService);
    repository = module.get(HourlyFuelFlowRepository);
    map = module.get(HourlyFuelFlowMap);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('export', () => {
    it('should return null given no fuel flows were found', async function() {
      await expect(service.export([])).resolves.toEqual([]);
    });

    it('returns export record for hourly fuel flow', async () => {
      const mockedValues = genHourlyFuelFlow<HrlyFuelFlow>(1);
      const promises = [];
      mockedValues.forEach(value => {
        promises.push(map.one(value));
      });
      const mapppedValues = await Promise.all(promises);
      jest.spyOn(repository, 'export').mockResolvedValue(mockedValues);
      await expect(
        service.export(
          mockedValues.map(value => {
            return value.hourId;
          }),
        ),
      ).resolves.toEqual(mapppedValues);
    });
  });
});
