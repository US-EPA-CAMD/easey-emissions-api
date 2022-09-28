import { Test, TestingModule } from '@nestjs/testing';
import { DailyFuelService } from './daily-fuel.service';
import { genDailyFuel } from '../../test/object-generators/daily-fuel';
import { faker } from '@faker-js/faker';
import { DailyFuelMap } from '../maps/daily-fuel.map';
import { DailyFuel } from '../entities/daily-fuel.entity';
import { DailyFuelRepository } from './daily-fuel.repository';

describe('DailyFuelService', () => {
  let service: DailyFuelService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailyFuelService],
    }).compile();

    service = module.get<DailyFuelService>(DailyFuelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('export', () => {
    it('should export a record', async function() {
      const dailyEmissionIds = faker.helpers.uniqueArray(
        faker.datatype.string,
        3,
      );
      const dailyFuelMocks = genDailyFuel<DailyFuel>(3);

      const mappedDailyFuel = await new DailyFuelMap().many(dailyFuelMocks);

      await expect(service.export(dailyEmissionIds)).resolves.toEqual(
        mappedDailyFuel,
      );
    });
  });
});
