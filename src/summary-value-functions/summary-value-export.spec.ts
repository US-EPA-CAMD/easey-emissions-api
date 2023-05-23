import { genSummaryValue } from '../../test/object-generators/summary-value';
import {
  exportSupplementarySummaryValues,
  exportSupplementarySummaryValuesQuery,
} from './summary-value-export';
import { SummaryValueRepository } from '../summary-value/summary-value.repository';
import { SummaryValue } from '../entities/summary-value.entity';
import { SummaryValueMap } from '../maps/summary-value.map';
import { genSummaryValueParamsDtos } from '../../test/object-generators/summary-value-dto';
import { SelectQueryBuilder } from 'typeorm';
import { mockQueryBuilder } from '../../test/mocks/mock-query-builder';
import { Test } from '@nestjs/testing';
import { SummaryValueParamsDto } from '../dto/summary-value-params.dto';

describe('SummaryValueExport', () => {
  let map: SummaryValueMap;
  let queryBuilder: any;
  let repository: SummaryValueRepository;
  let summaryValueExportModule: typeof import('./summary-value-export');

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SummaryValueRepository,
        { provide: SelectQueryBuilder, useValue: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get(SummaryValueRepository);
    queryBuilder = module.get<SelectQueryBuilder<SummaryValue>>(
      SelectQueryBuilder,
    );
    map = new SummaryValueMap();
    summaryValueExportModule = await import('./summary-value-export');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should run the queries in exportSupplementarySummaryValuesQuery successfully', async () => {
    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
    queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
    queryBuilder.innerJoin.mockReturnValue(queryBuilder);
    queryBuilder.getMany.mockResolvedValue([]);

    const result = await exportSupplementarySummaryValuesQuery(
      genSummaryValueParamsDtos()[0],
      repository,
    );
    expect(result).toEqual([]);
  });

  it('should export mapped summary value data given the correct endpoint parameters', async function() {
    const mockSummaryValues = [genSummaryValue<SummaryValue>()[0]];
    jest
      .spyOn(summaryValueExportModule, 'exportSupplementarySummaryValuesQuery')
      .mockResolvedValue(mockSummaryValues);
    const mappedValues = await map.many(mockSummaryValues);

    await expect(
      exportSupplementarySummaryValues(
        genSummaryValueParamsDtos()[0],
        repository,
      ),
    ).resolves.toEqual(mappedValues);
  });
});
