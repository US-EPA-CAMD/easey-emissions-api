import { Nsps4tSummaryWorkspaceRepository } from '../nsps4t-summary-workspace-new/nsps4t-summary-workspace.repository';
import { genNsps4tSummaryImportDto } from '../../test/object-generators/nsps4t-summary-dto';
import { faker } from '@faker-js/faker';

describe('ImportNsps4tSummaryData', () => {
  let repository: Nsps4tSummaryWorkspaceRepository;
  let importNsps4tSummaryModule: typeof import('./import-nsps4t-summary-data');

  beforeAll(async () => {
    repository = new Nsps4tSummaryWorkspaceRepository();
    importNsps4tSummaryModule = await import('./import-nsps4t-summary-data');
  });

  it('should import data', async function() {
    const imports = [
      ...genNsps4tSummaryImportDto(),
      ...genNsps4tSummaryImportDto(1, { include: ['nsps4tFourthQuarterData'] }),
      ...genNsps4tSummaryImportDto(1, {
        include: ['nsps4tCompliancePeriodData'],
      }),
      ...genNsps4tSummaryImportDto(1, {
        include: ['nsps4tFourthQuarterData', 'nsps4tCompliancePeriodData'],
      }),
    ];

    // @ts-expect-error force as undefined
    jest.spyOn(repository, 'create').mockResolvedValue(undefined);
    jest.spyOn(repository, 'save').mockResolvedValue(undefined);

    await Promise.all(
      imports.map(data => {
        expect(
          importNsps4tSummaryModule.importNsps4tSummaryData({
            data: {
              ...data,
              monitoringLocationId: faker.datatype.string(),
              reportingPeriodId: faker.datatype.number(),
              identifiers: {
                monitorFormulas: {},
                components: {},
                monitoringSystems: {},
              },
            },
            repository,
          }),
        ).resolves.toEqual(undefined);
      }),
    );
  });
});
