import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { mockQueryBuilder } from '../../test/mocks/mock-query-builder';
import { HrlyGasFlowMeter } from '../entities/workspace/hrly-gas-flow-meter.entity';
import { HourlyGasFlowMeterRepository } from './hourly-gas-flow-meter.repository';

import { Test } from '@nestjs/testing';

describe('--HourlyGasFlowMeterRepository--', () => {
  let repository: HourlyGasFlowMeterRepository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EntityManager,
        HourlyGasFlowMeterRepository,
        { provide: SelectQueryBuilder, useValue: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get(HourlyGasFlowMeterRepository);
    queryBuilder = module.get<SelectQueryBuilder<HrlyGasFlowMeter>>(
      SelectQueryBuilder,
    );

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);

    queryBuilder.leftJoinAndSelect.mockReturnValue(queryBuilder);
    queryBuilder.where.mockReturnValue(queryBuilder);
    queryBuilder.getMany.mockReturnValue('mockHourlyGasFlowMeter');
  });

  describe('export', () => {
    it('returns export record for hourly gas flow meter data', async () => {
      let result = await repository.export(['123']);
      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual('mockHourlyGasFlowMeter');
    });
  });
});
