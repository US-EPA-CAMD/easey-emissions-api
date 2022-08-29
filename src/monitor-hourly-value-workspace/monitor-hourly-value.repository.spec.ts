import { Test } from '@nestjs/testing';
import { MonitorHrlyValue } from '../entities/workspace/monitor-hrly-value.entity';
import { SelectQueryBuilder } from 'typeorm';
import { MonitorHourlyValueWorkspaceRepository } from './monitor-hourly-value.repository';

const mockQueryBuilder = () => ({
  leftJoinAndSelect: jest.fn(),
  where: jest.fn(),
  getMany: jest.fn(),
});

describe('-- MonitorHourlyValueWorkspaceRepository --', () => {
  let repository;
  let queryBuilder;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MonitorHourlyValueWorkspaceRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get(MonitorHourlyValueWorkspaceRepository);
    queryBuilder = module.get<SelectQueryBuilder<MonitorHrlyValue>>(
      SelectQueryBuilder,
    );

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);

    queryBuilder.leftJoinAndSelect.mockReturnValue(queryBuilder);
    queryBuilder.where.mockReturnValue(queryBuilder);
    queryBuilder.getMany.mockReturnValue('mockMonitorHourlyValue');
  });

  describe('export', () => {
    it('returns export record for monitor hourly value  data', async () => {
      let result = await repository.export(['123']);

      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual('mockMonitorHourlyValue');
    });
  });
});
