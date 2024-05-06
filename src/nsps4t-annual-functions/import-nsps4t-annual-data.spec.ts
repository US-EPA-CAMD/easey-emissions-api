import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';

import { genNsps4tAnnualImportDto } from '../../test/object-generators/nsps4t-annual-dto';
import { Nsps4tAnnualWorkspaceRepository } from '../nsps4t-annual-workspace/nsps4t-annual-workspace.repository';

describe('ImportNsps4tAnnualData', () => {
  let repository: Nsps4tAnnualWorkspaceRepository;
  let importNsps4tAnnualModule: typeof import('./import-nsps4t-annual-data');

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntityManager, Nsps4tAnnualWorkspaceRepository],
    }).compile();

    repository = module.get(Nsps4tAnnualWorkspaceRepository);
    importNsps4tAnnualModule = await import('./import-nsps4t-annual-data');
  });

  it('should import data', async function () {
    const imports = [...genNsps4tAnnualImportDto(3)];

    // @ts-expect-error force as undefined
    jest.spyOn(repository, 'create').mockResolvedValue(undefined);
    jest.spyOn(repository, 'save').mockResolvedValue(undefined);

    const identifiers = { locations: {}, userId: '' };
    const monitoringLocationId = faker.datatype.string();
    identifiers.locations[monitoringLocationId] = { components: {}, monitorFormulas: {}, monitoringSystems: {} };

    await Promise.all(
      imports.map(data => {
        expect(
          importNsps4tAnnualModule.importNsps4tAnnualData({
            data: {
              ...data,
              monitoringLocationId: faker.datatype.string(),
              reportingPeriodId: faker.datatype.number(),
              nsps4tSumId: faker.datatype.string(),
              identifiers,
            },
            repository,
          }),
        ).resolves.toEqual(undefined);
      }),
    );
  });
});
