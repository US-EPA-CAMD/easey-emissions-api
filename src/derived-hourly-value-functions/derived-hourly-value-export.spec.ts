import { DerivedHourlyValueMap } from '../maps/derived-hourly-value.map';
import { DerivedHourlyValueRepository } from '../derived-hourly-value/derived-hourly-value.repository';
import {
  genDerivedHourlyValueParamsDto,
  genDerivedHrlyValues,
} from '../../test/object-generators/derived-hourly-value';
import { DerivedHrlyValue } from '../entities/derived-hrly-value.entity';
import {
  exportSupplementaryDerivedHourlyValues,
  exportSupplementaryDerivedHourlyValuesQuery,
} from './derived-hourly-value-export';
import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';
import { mockQueryBuilder } from '../../test/mocks/mock-query-builder';
import { DerivedHourlyValueParamsDto } from '../dto/derived-hourly-value-params.dto';

describe('DerivedHourlyValueExport', () => {
  let map: DerivedHourlyValueMap;
  let repository: DerivedHourlyValueRepository;
  let queryBuilder: any;
  let derivedHourlyExportModule: typeof import('./derived-hourly-value-export');

  beforeEach(async () => {
    map = new DerivedHourlyValueMap();
    // repository = new DerivedHourlyValueRepository();
    derivedHourlyExportModule = await import('./derived-hourly-value-export');

    const module = await Test.createTestingModule({
      providers: [
        DerivedHourlyValueRepository,
        {
          provide: SelectQueryBuilder,
          useValue: mockQueryBuilder,
        },
      ],
    }).compile();

    repository = module.get(DerivedHourlyValueRepository);
    queryBuilder = module.get(SelectQueryBuilder);

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
    queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
    queryBuilder.innerJoin.mockReturnValue(queryBuilder);
    queryBuilder.leftJoinAndSelect.mockReturnValue(queryBuilder);
    queryBuilder.getMany.mockReturnValue([]);
  });

  it('should successfully create and run query for export', async () => {
    const params = genDerivedHourlyValueParamsDto()[0];
    params.orisCode = [1, 2, 3];
    params.locationName = ['a', 'b', 'c'];
    const result = await exportSupplementaryDerivedHourlyValuesQuery(
      params,
      repository,
    );
    expect(result.length).toBe(0);
  });

  it('should export derived hourly values given correct endpoint parameters', async function() {
    const mockderivedHourlyValues = genDerivedHrlyValues<DerivedHrlyValue>();

    jest
      .spyOn(
        derivedHourlyExportModule,
        'exportSupplementaryDerivedHourlyValuesQuery',
      )
      .mockResolvedValue(mockderivedHourlyValues);
    const mappedValues = await map.many(mockderivedHourlyValues);

    await expect(
      exportSupplementaryDerivedHourlyValues(
        genDerivedHourlyValueParamsDto()[0],
        repository,
      ),
    ).resolves.toEqual(mappedValues);
  });
});
