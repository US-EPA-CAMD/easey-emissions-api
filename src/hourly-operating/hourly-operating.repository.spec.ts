import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { mockQueryBuilder } from '../../test/mocks/mock-query-builder';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { HrlyOpData } from '../entities/workspace/hrly-op-data.entity';
import { HourlyOperatingRepository } from './hourly-operating.repository';

let filters = new EmissionsParamsDTO();

describe('-- HourlyOperatingRepository --', () => {
  let repository;
  let queryBuilder;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EntityManager,
        HourlyOperatingRepository,
        { provide: SelectQueryBuilder, useValue: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get(HourlyOperatingRepository);
    queryBuilder = module.get<SelectQueryBuilder<HrlyOpData>>(
      SelectQueryBuilder,
    );

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);

    queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
    queryBuilder.leftJoinAndSelect.mockReturnValue(queryBuilder);
    queryBuilder.where.mockReturnValue(queryBuilder);
    queryBuilder.andWhere.mockReturnValue(queryBuilder);
    queryBuilder.orderBy.mockReturnValue(queryBuilder);
    queryBuilder.getMany.mockReturnValue('mockHourlyOperating');
  });

  describe('export', () => {
    it('returns export record for hourly operating data', async () => {
      let result = await repository.export(
        filters.monitorPlanId,
        filters.year,
        filters.quarter,
      );

      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual('mockHourlyOperating');
    });
  });
});
