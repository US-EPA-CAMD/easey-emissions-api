import { Nsps4tAnnualRepository } from '../nsps4t-annual/nsps4t-annual.repository';
import { faker } from '@faker-js/faker';
import { genNsps4tAnnual } from '../../test/object-generators/nsps4t-annual';
import { Nsps4tAnnual } from '../entities/nsps4t-annual.entity';
import { Nsps4tAnnualMap } from '../maps/nsps4t-annual.map';

describe('ExportNsps4tAnnualData', () => {
  let nsps4tAnnualRepository: Nsps4tAnnualRepository;
  let exportNsps4tAnnualModule: typeof import('./export-nsps4t-annual-data');

  beforeAll(async () => {
    nsps4tAnnualRepository = new Nsps4tAnnualRepository();
    exportNsps4tAnnualModule = await import('./export-nsps4t-annual-data');
  });

  it('should export records', async function() {
    const nsps4tSummaryIds = faker.helpers.uniqueArray(
      faker.datatype.string,
      3,
    );
    const nsps4tAnnualMocks = genNsps4tAnnual<Nsps4tAnnual>(3);
    const mappedNsps4tAnnual = await new Nsps4tAnnualMap().many(
      nsps4tAnnualMocks,
    );

    jest
      .spyOn(exportNsps4tAnnualModule, 'exportNsps4tAnnualQuery')
      .mockResolvedValue(nsps4tAnnualMocks);

    await expect(
      exportNsps4tAnnualModule.exportNsps4tAnnualData({
        nsps4tSummaryIds,
        repository: nsps4tAnnualRepository,
      }),
    ).resolves.toEqual(mappedNsps4tAnnual);
  });
});
