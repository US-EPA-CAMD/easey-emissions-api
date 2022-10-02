import { mockQueryBuilder } from '../../test/mocks/mock-query-builder';
import { SelectQueryBuilder } from 'typeorm';
import { Test } from '@nestjs/testing';
import { HrlyGasFlowMeter } from '../entities/workspace/hrly-gas-flow-meter.entity';
import { HourlyGasFlowMeterWorkspaceRepository } from './hourly-gas-flow-meter.repository';

describe('--HourlyGasFlowMeterWorkspaceRepository--', () => {
  let repository: HourlyGasFlowMeterWorkspaceRepository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        HourlyGasFlowMeterWorkspaceRepository,
        { provide: SelectQueryBuilder, useValue: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get(HourlyGasFlowMeterWorkspaceRepository);
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
