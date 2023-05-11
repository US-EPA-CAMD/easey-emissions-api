import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';
import { mockQueryBuilder } from '../../test/mocks/mock-query-builder';
import { PlantRepository } from './plant.repository';

describe('Monitor plan repository tests', () => {
  let repository: PlantRepository;
  let queryBuilder: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PlantRepository,
        {
          provide: SelectQueryBuilder,
          useValue: mockQueryBuilder,
        },
      ],
    }).compile();

    repository = module.get(PlantRepository);
    queryBuilder = module.get(SelectQueryBuilder);

    queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
    queryBuilder.leftJoin.mockReturnValue(queryBuilder);
    queryBuilder.leftJoinAndSelect.mockReturnValue(queryBuilder);
    queryBuilder.where.mockReturnValue(queryBuilder);
    queryBuilder.andWhere.mockReturnValue(queryBuilder);

    queryBuilder.getOne.mockResolvedValue('mockPlant');

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
  });

  describe('Plant repository getImportLocations() test', () => {
    it('gets the expected result from getOne()', async () => {
      const result = await repository.getImportPlant({
        orisCode: 123,
        stackIds: ['1'],
        unitIds: ['2'],
      });
      expect(queryBuilder.getOne).toHaveBeenCalled();
      expect(result).toEqual('mockPlant');
    });
  });
});
