import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';
import { SorbentTrapWorkspaceRepository } from '../sorbent-trap-workspace/sorbent-trap-workspace.repository';
import { faker } from '@faker-js/faker';
import { genSorbentTrapImportDto } from '../../test/object-generators/sorbent-trap-dto';

describe('ImportSorbentTrapData', () => {
  let repository: SorbentTrapWorkspaceRepository;
  let importSorbentTrapModule: typeof import('./import-sorbent-trap-data');

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntityManager, SorbentTrapWorkspaceRepository],
    }).compile();

    repository = module.get(SorbentTrapWorkspaceRepository);
    importSorbentTrapModule = await import('./import-sorbent-trap-data');
  });

  it('should import data', async function () {
    const importReturn = [
      ...genSorbentTrapImportDto(3),
      ...genSorbentTrapImportDto(3, { include: ['samplingTrainData'] }),
    ];

    // @ts-expect-error force as undefined
    jest.spyOn(repository, 'create').mockResolvedValue(undefined);
    jest.spyOn(repository, 'save').mockResolvedValue(undefined);
    jest.spyOn(repository, 'delete').mockResolvedValue(undefined);

    await Promise.all(
      importReturn.map(data => {
        const identifiers = { locations: {}, userId: '' };
        const monitoringLocationId = faker.datatype.string();
        identifiers.locations[monitoringLocationId] = { components: {}, monitorFormulas: {}, monitoringSystems: {} };
        expect(
          importSorbentTrapModule.importSorbentTrapData({
            data: {
              ...data,
              reportingPeriodId: faker.datatype.number(),
              monitoringLocationId: monitoringLocationId,
              identifiers,
            },
            repository,
          }),
        ).resolves.toEqual(undefined);
      }),
    );
  });
});
