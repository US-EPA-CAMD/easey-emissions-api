import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import { HourlyOperatingRepository } from '../hourly-operating/hourly-operating.repository';
import { genHourlyOpValues } from '../../test/object-generators/hourly-op-data-values';
import { HrlyOpData } from '../entities/hrly-op-data.entity';
import { genHourlyOperatingParamsDto } from '../../test/object-generators/hourly-operating-dto';
import {
  exportSupplementaryHourlyOperatingData,
  exportSupplementaryHourlyOperatingDataQuery,
} from './hourly-operating-export';
import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';
import { mockQueryBuilder } from '../../test/mocks/mock-query-builder';

describe('HourlyOperatingExport', () => {
  let map: HourlyOperatingMap;
  let repository: HourlyOperatingRepository;
  let hourlyOperatingExportModule: typeof import('./hourly-operating-export');
  let queryBuilder: any;

  beforeAll(async () => {
    map = new HourlyOperatingMap();
    repository = new HourlyOperatingRepository();
    hourlyOperatingExportModule = await import('./hourly-operating-export');

    const module = await Test.createTestingModule({
      providers: [
        HourlyOperatingRepository,
        {
          provide: SelectQueryBuilder,
          useValue: mockQueryBuilder,
        },
      ],
    }).compile();

    repository = module.get(HourlyOperatingRepository);
    queryBuilder = module.get(SelectQueryBuilder);

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
    queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
    queryBuilder.innerJoin.mockReturnValue(queryBuilder);
    queryBuilder.leftJoinAndSelect.mockReturnValue(queryBuilder);
    queryBuilder.getMany.mockReturnValue([]);
  });

  it('should successfully create and run query for export', async () => {
    const params = genHourlyOperatingParamsDto()[0];
    params.orisCode = [1, 2, 3];
    params.locationName = ['a', 'b', 'c'];
    const result = await exportSupplementaryHourlyOperatingDataQuery(
      params,
      repository,
    );
    expect(result.length).toBe(0);
  });

  it('should export hourly operating data given correct endpoint parameters', async function() {
    const mockHourlyOperatingData = genHourlyOpValues<HrlyOpData>();
    jest
      .spyOn(
        hourlyOperatingExportModule,
        'exportSupplementaryHourlyOperatingDataQuery',
      )
      .mockResolvedValue(mockHourlyOperatingData);
    const mappedValues = await map.many(mockHourlyOperatingData);

    await expect(
      exportSupplementaryHourlyOperatingData(
        genHourlyOperatingParamsDto()[0],
        repository,
      ),
    ).resolves.toEqual(mappedValues);
  });
});
