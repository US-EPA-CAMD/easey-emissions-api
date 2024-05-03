import { genSamplingTrainImportDto } from '../../test/object-generators/sampling-train-dto';
import { SamplingTrainWorkspaceRepository } from '../sampling-train-workspace/sampling-train-workspace.repository';
import { faker } from '@faker-js/faker';

describe('ImportSamplingTrainData', () => {
  let repository: SamplingTrainWorkspaceRepository;
  let importSamplingTrainModule: typeof import('./import-sampling-train-data');

  beforeAll(async () => {
    repository = new SamplingTrainWorkspaceRepository();
    importSamplingTrainModule = await import('./import-sampling-train-data');
  });

  it('should import data', async function() {
    const importReturn = [...genSamplingTrainImportDto(3)];

    // @ts-expect-error force as undefined
    jest.spyOn(repository, 'create').mockResolvedValue(undefined);
    jest.spyOn(repository, 'save').mockResolvedValue(undefined);

    const identifiers = { locations: {}, userId: '' };
    const monitoringLocationId = faker.datatype.string();
    identifiers.locations[monitoringLocationId] = { components: {}, monitorFormulas: {}, monitoringSystems: {} };

    await Promise.all(
      importReturn.map(data => {
        expect(
          importSamplingTrainModule.importSamplingTrainData({
            data: {
              ...data,
              sorbentTrapId: faker.datatype.string(),
              reportingPeriodId: faker.datatype.number(),
              monitoringLocationId: faker.datatype.string(),
              identifiers,
            },
            repository,
          }),
        ).resolves.toEqual(undefined);
      }),
    );
  });
});
