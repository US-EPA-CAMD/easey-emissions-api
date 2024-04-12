import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { mockQueryBuilder } from '../../test/mocks/mock-query-builder';
import { EmissionEvaluation } from '../entities/workspace/emission-evaluation.entity';
import { EmissionsWorkspaceRepository } from './emissions.repository';

describe('Emisions Workspace Repository Test', () => {
  let repository;
  let queryBuilder;

  let mockedResult = new EmissionEvaluation();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EmissionsWorkspaceRepository,
        EntityManager,
        { provide: SelectQueryBuilder, useValue: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get(EmissionsWorkspaceRepository);
    queryBuilder = module.get<SelectQueryBuilder<EmissionEvaluation>>(
      SelectQueryBuilder,
    );

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);

    repository.query = jest.fn();

    queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
    queryBuilder.where.mockReturnValue(queryBuilder);
    queryBuilder.andWhere.mockReturnValue(queryBuilder);
    queryBuilder.getOne.mockResolvedValue(mockedResult);
  });

  describe('export', () => {
    it('successfully exports emission evaluation data for workspace', async () => {
      let result = await repository.export('', 1, 1);
      expect(queryBuilder.getOne).toHaveBeenCalled();
      expect(result).toEqual(mockedResult);
    });
  });

  describe('updateAllViews', () => {
    it('successfully calls updateAllViews()', async () => {
      await repository.updateAllViews();
      expect(repository.query).toBeCalled();
    });
  });
});
