import { Test } from '@nestjs/testing';
import { DataSource, EntityManager } from 'typeorm';

import { genHourlyParamFuelFlow } from '../../test/object-generators/hourly-param-fuel-flow';
import { HrlyParamFuelFlow } from '../entities/hrly-param-fuel-flow.entity';
import { HourlyParameterFuelFlowMap } from '../maps/hourly-parameter-fuel-flow.map';
import { HourlyParameterFuelFlowService } from './hourly-parameter-fuel-flow.service';

const mockRepository = {
  export: jest.fn(),
};

jest.mock('./hourly-parameter-fuel-flow.repository', () => ({
  HourlyParameterFuelFlowRepository: jest.fn().mockImplementation(() => mockRepository),
}));

describe('HourlyParameterFuelFlowWoskpaceService', () => {
  let service: HourlyParameterFuelFlowService;
  let repository: any;
  let map: HourlyParameterFuelFlowMap;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EntityManager,
        HourlyParameterFuelFlowService,
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
              manager: {
                connection: {},
                queryRunner: {},
              }
            }),
          },
        }
      ],
    }).compile();

    service = module.get(HourlyParameterFuelFlowService);
    map = module.get(HourlyParameterFuelFlowMap);
    repository = mockRepository;
  });

  describe('export', () => {
    it('should return the correct shape of data given correct inputs', async function () {
      const hourlyParams = genHourlyParamFuelFlow<HrlyParamFuelFlow>(3);
      const mappedParams = await map.many(hourlyParams);

      jest.spyOn(repository, 'export').mockResolvedValue(hourlyParams);

      await expect(service.export(123, ['123'])).resolves.toEqual(mappedParams);
    });
  });
});