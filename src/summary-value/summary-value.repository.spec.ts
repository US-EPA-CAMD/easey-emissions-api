import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';

import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { mockQueryBuilder } from '../../test/mocks/mock-query-builder';
import { SummaryValueRepository } from './summary-value.repository';
import { SummaryValue } from '../entities/workspace/summary-value.entity';
import { genSummaryValue } from '../../test/object-generators/summary-value';

let filters = new EmissionsParamsDTO();

describe('Summary Value Repository Test', () => {
  let repository;
  let queryBuilder;

  const summaryValueEntities = genSummaryValue<SummaryValue>(1);

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SummaryValueRepository,
        { provide: SelectQueryBuilder, useValue: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get(SummaryValueRepository);
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
