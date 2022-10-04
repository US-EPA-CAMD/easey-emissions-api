import { DailyEmissionRepository } from '../daily-emission/daily-emission.repository';
import { genDailyEmission } from '../../test/object-generators/daily-emission';
import { DailyEmission } from '../entities/daily-emission.entity';
import { DailyEmissionMap } from '../maps/daily-emission.map';
import { faker } from '@faker-js/faker';

describe('ExportDailyEmissionData', () => {
  let dailyEmissionRepository;
  let exportDailyEmissionModule: typeof import('./export-daily-emission-data');

  beforeAll(async () => {
    dailyEmissionRepository = new DailyEmissionRepository();
    exportDailyEmissionModule = await import('./export-daily-emission-data');
  });

  it('should export records', async function() {
    const dailyEmissionMocks = genDailyEmission<DailyEmission>(3);
    const mappedDailyEmision = await new DailyEmissionMap().many(
      dailyEmissionMocks,
    );

    jest
      .spyOn(exportDailyEmissionModule, 'exportDailyEmissionQuery')
      .mockResolvedValue(dailyEmissionMocks);

    await expect(
      exportDailyEmissionModule.exportDailyEmissionData({
        quarter: faker.helpers.arrayElement([1, 2, 3, 4]),
        year: faker.date.soon().getFullYear(),
        repository: dailyEmissionRepository,
        monitoringLocationIds: faker.helpers.uniqueArray(
          faker.datatype.string,
          3,
        ),
      }),
    ).resolves.toEqual(mappedDailyEmision);
  });
});
