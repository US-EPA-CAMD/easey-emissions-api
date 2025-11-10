import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { HourlyFuelFlowService } from './hourly-fuel-flow.service';
import { HourlyFuelFlowMap } from '../maps/hourly-fuel-flow-map';
import { HourlyParameterFuelFlowService } from '../hourly-parameter-fuel-flow/hourly-parameter-fuel-flow.service';
import { HourlyParameterFuelFlowMap } from '../maps/hourly-parameter-fuel-flow.map';
import { genHourlyFuelFlow } from '../../test/object-generators/hourly-fuel-flow';
import { HrlyFuelFlow } from '../entities/hrly-fuel-flow.entity';
import { mockHourlyFuelFlowRepository } from '../../test/mocks/mock-hourly-fuel-flow-repository';

jest.mock('./hourly-fuel-flow.repository', () => ({
  HourlyFuelFlowRepository: jest.fn().mockImplementation(() => mockHourlyFuelFlowRepository),
}));

describe('HourlyFuelFlowService', () => {
  let service: HourlyFuelFlowService;
  let map: HourlyFuelFlowMap;
  let repository: any;

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

    service = module.get(HourlyFuelFlowService);
    repository = mockHourlyFuelFlowRepository;
    map = module.get(HourlyFuelFlowMap);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('export', () => {
    it('should return null given no fuel flows were found', async function () {
      await expect(service.export(123, [])).resolves.toEqual([]);
    });

    it('returns export record for hourly fuel flow', async () => {
      const mockedValues = genHourlyFuelFlow<HrlyFuelFlow>(1);
      const promises = [];
      mockedValues.forEach(value => {
        promises.push(map.one(value));
      });
      const mapppedValues = await Promise.all(promises);
      jest.spyOn(repository, 'export').mockResolvedValue(mockedValues);
      await expect(service.export(123, ['123'])).resolves.toEqual(
        mapppedValues,
      );
    });
  });
});
