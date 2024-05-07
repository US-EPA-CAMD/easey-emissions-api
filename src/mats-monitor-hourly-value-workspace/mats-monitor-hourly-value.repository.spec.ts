import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { MatsMonitorHrlyValue } from '../entities/mats-monitor-hrly-value.entity';
import { MatsMonitorHourlyValueWorkspaceRepository } from './mats-monitor-hourly-value.repository';

const mockQueryBuilder = () => ({
  leftJoinAndSelect: jest.fn(),
  where: jest.fn(),
  getMany: jest.fn(),
});

describe('-- MatsMonitorHourlyValueWorkspaceRepository --', () => {
  let repository;
  let queryBuilder;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EntityManager,
        MatsMonitorHourlyValueWorkspaceRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get(MatsMonitorHourlyValueWorkspaceRepository);
    queryBuilder = module.get<SelectQueryBuilder<MatsMonitorHrlyValue>>(
      SelectQueryBuilder,
    );

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);

    queryBuilder.leftJoinAndSelect.mockReturnValue(queryBuilder);
    queryBuilder.where.mockReturnValue(queryBuilder);
    queryBuilder.getMany.mockReturnValue('mockMatsMonitorHourlyValue');
  });

  describe('export', () => {
    it('returns export record for mats monitor hourly value data', async () => {
      let result = await repository.export(['123']);

      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual('mockMatsMonitorHourlyValue');
    });
  });
});
