import { genSummaryValue } from '../../test/object-generators/summary-value';
import { exportSupplementarySummaryValues } from './summary-value-export';
import { SummaryValueRepository } from '../summary-value/summary-value.repository';
import { SummaryValue } from '../entities/summary-value.entity';
import { SummaryValueMap } from '../maps/summary-value.map';
import { genSummaryValueParamsDtos } from '../../test/object-generators/summary-value-dto';

describe('SummaryValueExport', () => {
  let map: SummaryValueMap;
  let repository: SummaryValueRepository;
  let summaryValueExportModule: typeof import('./summary-value-export');

  beforeAll(async () => {
    map = new SummaryValueMap();
    repository = new SummaryValueRepository();
    summaryValueExportModule = await import('./summary-value-export');
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
