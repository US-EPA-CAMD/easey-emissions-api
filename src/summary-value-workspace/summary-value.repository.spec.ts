import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { mockQueryBuilder } from '../../test/mocks/mock-query-builder';
import { genSummaryValue } from '../../test/object-generators/summary-value';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { SummaryValue } from '../entities/workspace/summary-value.entity';
import { SummaryValueWorkspaceRepository } from './summary-value.repository';

let filters = new EmissionsParamsDTO();

describe('Summary Value Workspace Repository Test', () => {
  let repository;
  let queryBuilder;

  const summaryValueEntities = genSummaryValue<SummaryValue>(1);

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EntityManager,
        SummaryValueWorkspaceRepository,
        { provide: SelectQueryBuilder, useValue: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get(SummaryValueWorkspaceRepository);
    queryBuilder = module.get<SelectQueryBuilder<SummaryValue>>(
      SelectQueryBuilder,
    );

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);

    queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
    queryBuilder.leftJoinAndSelect.mockReturnValue(queryBuilder);
    queryBuilder.where.mockReturnValue(queryBuilder);
    queryBuilder.andWhere.mockReturnValue(queryBuilder);
    queryBuilder.getMany.mockResolvedValue(summaryValueEntities);
  });

  describe('export', () => {
    it('successfully exports summary value data', async () => {
      let result = await repository.export(
        filters.monitorPlanId,
        filters.year,
        filters.quarter,
      );

      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual(summaryValueEntities);
    });
  });
});
