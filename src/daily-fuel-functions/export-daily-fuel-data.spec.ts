import { genDailyFuel } from '../../test/object-generators/daily-fuel';
import { DailyFuel } from '../entities/daily-fuel.entity';
import { DailyFuelMap } from '../maps/daily-fuel.map';
import { exportDailyFuelData } from './export-daily-fuel-data';
import { faker } from '@faker-js/faker';
import { DailyFuelRepository } from '../daily-fuel/daily-fuel.repository';

describe('ExportDailyFuelData', () => {
  let dailyFuelRepository;

  beforeAll(async () => {
    dailyFuelRepository = new DailyFuelRepository();
  });

  it('should export records', async function() {
    const dailyEmissionIds = faker.helpers.uniqueArray(
      faker.datatype.string,
      3,
    );
    const dailyFuelMocks = genDailyFuel<DailyFuel>(3);
    const mappedDailyFuel = await new DailyFuelMap().many(dailyFuelMocks);

    const createQueryBuilder: any = {
      where: () => {
        return {
          getMany: () => dailyFuelMocks,
        };
      },
    };
    jest
      .spyOn(dailyFuelRepository, 'createQueryBuilder')
      .mockImplementationOnce(() => createQueryBuilder);

    await expect(
      exportDailyFuelData({
        dailyEmissionIds,
        repository: dailyFuelRepository,
      }),
    ).resolves.toEqual(mappedDailyFuel);
  });
});
