import { Nsps4tAnnualWorkspaceRepository } from '../nsps4t-annual-workspace/nsps4t-annual-workspace.repository';
import { genNsps4tAnnualImportDto } from '../../test/object-generators/nsps4t-annual-dto';
import { faker } from '@faker-js/faker';

describe('ImportNsps4tAnnualData', () => {
  let repository: Nsps4tAnnualWorkspaceRepository;
  let importNsps4tAnnualModule: typeof import('./import-nsps4t-annual-data');

  beforeAll(async () => {
    repository = new Nsps4tAnnualWorkspaceRepository();
    importNsps4tAnnualModule = await import('./import-nsps4t-annual-data');
  });

  it('should import data', async function() {
    const imports = [...genNsps4tAnnualImportDto(3)];

    jest
      .spyOn(importNsps4tAnnualModule, 'importNsps4tAnnualData')
      .mockResolvedValue(undefined);

    await Promise.all(
      imports.map(data => {
        expect(
          importNsps4tAnnualModule.importNsps4tAnnualData({
            data: {
              ...data,
              monitoringLocationId: faker.datatype.string(),
              reportingPeriodId: faker.datatype.number(),
              nsps4tSumId: faker.datatype.string(),
              identifiers: {
                monitoringSystems: {},
                components: {},
                monitorFormulas: {},
              },
            },
            repository,
          }),
        ).resolves.toEqual(undefined);
      }),
    );
  });
});
