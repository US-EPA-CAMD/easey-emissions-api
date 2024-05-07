import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';

import { genDailyFuel } from '../../test/object-generators/daily-fuel';
import { DailyFuelRepository } from '../daily-fuel/daily-fuel.repository';
import { DailyFuel } from '../entities/daily-fuel.entity';
import { DailyFuelMap } from '../maps/daily-fuel.map';

describe('ExportDailyFuelData', () => {
  let dailyFuelRepository;
  let exportDailyFuelModule: typeof import('./export-daily-fuel-data');

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntityManager, DailyFuelRepository],
    }).compile();

    dailyFuelRepository = module.get(DailyFuelRepository);
    exportDailyFuelModule = await import('./export-daily-fuel-data');
  });

  it('should export records', async function() {
    const dailyEmissionIds = faker.helpers.uniqueArray(
      faker.datatype.string,
      3,
    );
    const dailyFuelMocks = genDailyFuel<DailyFuel>(3);
    const mappedDailyFuel = await new DailyFuelMap().many(dailyFuelMocks);

    jest
      .spyOn(exportDailyFuelModule, 'exportDailyFuelQuery')
      .mockResolvedValue(dailyFuelMocks);

    await expect(
      exportDailyFuelModule.exportDailyFuelData({
        dailyEmissionIds,
        repository: dailyFuelRepository,
      }),
    ).resolves.toEqual(mappedDailyFuel);
  });
});
