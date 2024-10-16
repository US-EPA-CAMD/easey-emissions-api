import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { mockQueryBuilder } from '../../test/mocks/mock-query-builder';
import { genLongTermFuelFlow } from '../../test/object-generators/long-term-fuel-flow';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { LongTermFuelFlow } from '../entities/long-term-fuel-flow.entity';
import { LongTermFuelFlowRepository } from './long-term-fuel-flow.repository';

let filters = new EmissionsParamsDTO();

describe('Long Term Fuel Flow Repository Test', () => {
  let repository;
  let queryBuilder;

  const longTermFuelFlowEntities = genLongTermFuelFlow<LongTermFuelFlow>(1);

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EntityManager,
        LongTermFuelFlowRepository,
        { provide: SelectQueryBuilder, useValue: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get(LongTermFuelFlowRepository);
    queryBuilder = module.get<SelectQueryBuilder<LongTermFuelFlow>>(
      SelectQueryBuilder,
    );

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);

    queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
    queryBuilder.leftJoinAndSelect.mockReturnValue(queryBuilder);
    queryBuilder.where.mockReturnValue(queryBuilder);
    queryBuilder.andWhere.mockReturnValue(queryBuilder);
    queryBuilder.getMany.mockResolvedValue(longTermFuelFlowEntities);
  });

  describe('export', () => {
    it('successfully exports long term fuel flow data', async () => {
      let result = await repository.export(
        filters.monitorPlanId,
        filters.year,
        filters.quarter,
      );

      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual(longTermFuelFlowEntities);
    });
  });
});
