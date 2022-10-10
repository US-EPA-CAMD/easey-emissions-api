import { Nsps4tSummaryRepository } from '../nsps4t-summary/nsps4t-summary.repository';
import { genNsps4tSummary } from '../../test/object-generators/nsps4t-summary';
import { Nsps4tSummary } from '../entities/nsps4t-summary.entity';
import { Nsps4tSummaryMap } from '../maps/nsps4t-summary.map';
import { faker } from '@faker-js/faker';

describe('ExportNSPS4TSummary', () => {
  let nsps4tRepository;
  let exportNsps4tSummaryModule: typeof import('./export-nsps4t-summary-data');

  beforeAll(async () => {
    nsps4tRepository = new Nsps4tSummaryRepository();
    exportNsps4tSummaryModule = await import('./export-nsps4t-summary-data');
  });

  it('should export records', async function() {
    const nsps4tSummaryMocks = genNsps4tSummary<Nsps4tSummary>(3);
    const mappedNsps4tSummary = await new Nsps4tSummaryMap().many(
      nsps4tSummaryMocks,
    );

    jest
      .spyOn(exportNsps4tSummaryModule, 'exportNsps4tSummaryQuery')
      .mockResolvedValue(nsps4tSummaryMocks);

    await expect(
      exportNsps4tSummaryModule.exportNsps4tSummaryData({
        quarter: faker.helpers.arrayElement([1, 2, 3, 4]),
        year: faker.date.soon().getFullYear(),
        monitoringLocationIds: faker.helpers.uniqueArray(
          faker.datatype.string,
          3,
        ),
        repository: nsps4tRepository,
      }),
    ).resolves.toEqual(mappedNsps4tSummary);
  });
});
