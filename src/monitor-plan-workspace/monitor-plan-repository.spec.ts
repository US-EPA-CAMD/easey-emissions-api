import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';
import { mockQueryBuilder } from '../../test/mocks/mock-query-builder';
import { MonitorPlanWorkspaceRepository } from './monitor-plan-repository';

describe('Monitor plan repository tests', () => {
  let repository: MonitorPlanWorkspaceRepository;
  let queryBuilder: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MonitorPlanWorkspaceRepository,
        {
          provide: SelectQueryBuilder,
          useValue: mockQueryBuilder,
        },
      ],
    }).compile();

    repository = module.get(MonitorPlanWorkspaceRepository);
    queryBuilder = module.get(SelectQueryBuilder);

    queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
    queryBuilder.where.mockReturnValue(queryBuilder);
    queryBuilder.getMany.mockResolvedValue(['mockMonitorPlan']);

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
  });

  describe('getMonitorPlansByLocationIds test', () => {
    it('gets the expected result from getMany()', async () => {
      const result = await repository.getMonitorPlansByLocationIds([]);
      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual(['mockMonitorPlan']);
    });
  });
});
