import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { mockQueryBuilder } from '../../test/mocks/mock-query-builder';
import { EmissionsSubmissionsProgress } from '../entities/vw-emissions-submissions-progress.entity';
import { EmissionsSubmissionsProgressRepository } from './emissions-submissions-progress.repository';

describe('Emisions Repository Test', () => {
  let repository;
  let queryBuilder;

  let mockedResult = new EmissionsSubmissionsProgress();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EmissionsSubmissionsProgressRepository,
        EntityManager,
        { provide: SelectQueryBuilder, useValue: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get(EmissionsSubmissionsProgressRepository);
    queryBuilder = module.get<SelectQueryBuilder<EmissionsSubmissionsProgress>>(
      SelectQueryBuilder,
    );

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);

    queryBuilder.where.mockReturnValue(queryBuilder);
    queryBuilder.getOne.mockResolvedValue(mockedResult);
  });

  describe('getSubmissionProgress', () => {
    it('successfully makes query to get submission progress', async () => {
      let result = await repository.getSubmissionProgress(new Date(), 1);

      expect(queryBuilder.getOne).toHaveBeenCalled();
      expect(result).toEqual(mockedResult);
    });
  });
});
