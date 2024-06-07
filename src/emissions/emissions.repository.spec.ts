import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { mockQueryBuilder } from '../../test/mocks/mock-query-builder';
import { EmissionEvaluation } from '../entities/emission-evaluation.entity';
import { EmissionsRepository } from './emissions.repository';

describe('Emisions Repository Test', () => {
  let repository;
  let queryBuilder;

  let mockedResult = new EmissionEvaluation();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EmissionsRepository,
        EntityManager,
        { provide: SelectQueryBuilder, useValue: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get(EmissionsRepository);
    queryBuilder = module.get<SelectQueryBuilder<EmissionEvaluation>>(
      SelectQueryBuilder,
    );

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);

    queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
    queryBuilder.where.mockReturnValue(queryBuilder);
    queryBuilder.andWhere.mockReturnValue(queryBuilder);
    queryBuilder.getOne.mockResolvedValue(mockedResult);
  });

  describe('export', () => {
    it('successfully exports emission evaluation data', async () => {
      let result = await repository.export('', 1, 1);
      expect(queryBuilder.getOne).toHaveBeenCalled();
      expect(result).toEqual(mockedResult);
    });
  });
});
