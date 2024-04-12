import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { MonitorLocationWorkspaceRepository } from './monitor-location.repository';

const mockQueryBuilder = () => ({
  innerJoinAndSelect: jest.fn(),
  leftJoinAndSelect: jest.fn(),
  leftJoin: jest.fn(),
  where: jest.fn(),
  getMany: jest.fn(),
});

describe('location repository tests', () => {
  let repository: MonitorLocationWorkspaceRepository;
  let queryBuilder: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EntityManager,
        MonitorLocationWorkspaceRepository,
        {
          provide: SelectQueryBuilder,
          useFactory: mockQueryBuilder,
        },
      ],
    }).compile();

    repository = module.get(MonitorLocationWorkspaceRepository);
    queryBuilder = module.get(SelectQueryBuilder);

    queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
    queryBuilder.leftJoinAndSelect.mockReturnValue(queryBuilder);
    queryBuilder.leftJoin.mockReturnValue(queryBuilder);
    queryBuilder.where.mockReturnValue(queryBuilder);
    queryBuilder.getMany.mockResolvedValue('mockLocation');

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
  });

  describe('getLocationsByUnitStackPipeIds test', () => {
    it('calls the querybuilder and gets monitor location data', async () => {
      const result = await repository.getLocationsByUnitStackPipeIds(
        1,
        ['1'],
        ['1'],
      );
      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual('mockLocation');
    });
  });
});
