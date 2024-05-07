import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { mockQueryBuilder } from '../../test/mocks/mock-query-builder';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { WeeklyTestSummary } from '../entities/workspace/weekly-test-summary.entity';
import { WeeklyTestSummaryWorkspaceRepository } from './weekly-test-summary.repository';

let filters = new EmissionsParamsDTO();

describe('-- WeeklyTestSummaryWorkspaceRepository --', () => {
  let repository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EntityManager,
        WeeklyTestSummaryWorkspaceRepository,
        { provide: SelectQueryBuilder, useValue: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get(WeeklyTestSummaryWorkspaceRepository);
    queryBuilder = module.get<SelectQueryBuilder<WeeklyTestSummary>>(
      SelectQueryBuilder,
    );

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);

    queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
    queryBuilder.leftJoinAndSelect.mockReturnValue(queryBuilder);
    queryBuilder.where.mockReturnValue(queryBuilder);
    queryBuilder.andWhere.mockReturnValue(queryBuilder);
    queryBuilder.getMany.mockReturnValue('mockWeeklyTestSummary');
  });

  describe('export', () => {
    it('returns export record for weekly test summary data', async () => {
      let result = await repository.export(
        filters.monitorPlanId,
        filters.year,
        filters.quarter,
      );

      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual('mockWeeklyTestSummary');
    });
  });
});
