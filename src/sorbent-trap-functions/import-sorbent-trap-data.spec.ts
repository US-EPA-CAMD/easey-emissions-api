import { SorbentTrapWorkspaceRepository } from '../sorbent-trap-workspace/sorbent-trap-workspace.repository';
import { faker } from '@faker-js/faker';
import { genSorbentTrapImportDto } from '../../test/object-generators/sorbent-trap-dto';

describe('ImportSorbentTrapData', () => {
  let repository: SorbentTrapWorkspaceRepository;
  let importSorbentTrapModule: typeof import('./import-sorbent-trap-data');

  beforeAll(async () => {
    repository = new SorbentTrapWorkspaceRepository();
    importSorbentTrapModule = await import('./import-sorbent-trap-data');
  });

  it('should import data', async function() {
    const importReturn = [
      ...genSorbentTrapImportDto(3),
      ...genSorbentTrapImportDto(3, { include: ['samplingTrainData'] }),
    ];

    jest
      .spyOn(importSorbentTrapModule, 'importSorbentTrapData')
      .mockResolvedValue(undefined);

    await Promise.all(
      importReturn.map(data => {
        expect(
          importSorbentTrapModule.importSorbentTrapData({
            data: {
              ...data,
              reportingPeriodId: faker.datatype.number(),
              monitoringLocationId: faker.datatype.string(),
              identifiers: {
                monitoringSystems: {},
                monitorFormulas: {},
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