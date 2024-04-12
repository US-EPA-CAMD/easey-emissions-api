import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';

import { genSamplingTrainImportDto } from '../../test/object-generators/sampling-train-dto';
import { SamplingTrainWorkspaceRepository } from '../sampling-train-workspace/sampling-train-workspace.repository';

describe('ImportSamplingTrainData', () => {
  let repository: SamplingTrainWorkspaceRepository;
  let importSamplingTrainModule: typeof import('./import-sampling-train-data');

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntityManager, SamplingTrainWorkspaceRepository],
    }).compile();

    repository = module.get(SamplingTrainWorkspaceRepository);
    importSamplingTrainModule = await import('./import-sampling-train-data');
  });

  it('should import data', async function() {
    const importReturn = [...genSamplingTrainImportDto(3)];

    // @ts-expect-error force as undefined
    jest.spyOn(repository, 'create').mockResolvedValue(undefined);
    jest.spyOn(repository, 'save').mockResolvedValue(undefined);

    await Promise.all(
      importReturn.map(data => {
        expect(
          importSamplingTrainModule.importSamplingTrainData({
            data: {
              ...data,
              sorbentTrapId: faker.datatype.string(),
              reportingPeriodId: faker.datatype.number(),
              monitoringLocationId: faker.datatype.string(),
              identifiers: {
                monitorFormulas: {},
                monitoringSystems: {},
                components: {},
              },
            },
            repository,
          }),
        ).resolves.toEqual(undefined);
      }),
    );
  });
});
