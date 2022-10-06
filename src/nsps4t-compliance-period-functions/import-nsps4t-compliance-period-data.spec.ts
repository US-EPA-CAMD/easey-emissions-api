import { Nsps4tCompliancePeriodWorkspaceRepository } from '../nsps4t-compliance-period-workspace/nsps4t-compliance-period-workspace.repository';
import { genNsps4tCompliancePeriodImportDTO } from '../../test/object-generators/nsps4t-compliance-period-dto';
import { faker } from '@faker-js/faker';

describe('ImportNsps4tCompliancePeriodData', () => {
  let repository: Nsps4tCompliancePeriodWorkspaceRepository;
  let importNsps4tCompliancePeriodModule: typeof import('./import-nsps4t-compliance-period-data');

  beforeAll(async () => {
    repository = new Nsps4tCompliancePeriodWorkspaceRepository();
    importNsps4tCompliancePeriodModule = await import(
      './import-nsps4t-compliance-period-data'
    );
  });

  it('should import data', async function() {
    const imports = [...genNsps4tCompliancePeriodImportDTO(3)];

    jest
      .spyOn(
        importNsps4tCompliancePeriodModule,
        'importNsps4tCompliancePeriodData',
      )
      .mockResolvedValue(undefined);

    await Promise.all(
      imports.map(data => {
        expect(
          importNsps4tCompliancePeriodModule.importNsps4tCompliancePeriodData({
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
