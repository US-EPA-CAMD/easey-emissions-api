import { Test, TestingModule } from '@nestjs/testing';
import { DailyFuelWorkspaceService } from './daily-fuel-workspace.service';
import { DailyFuelWorkspaceRepository } from './daily-fuel-workspace.repository';
import { genDailyFuel } from '../../test/object-generators/daily-fuel';
import { DailyFuel } from '../entities/workspace/daily-fuel.entity';
import { faker } from '@faker-js/faker';
import { DailyFuelMap } from '../maps/daily-fuel.map';

describe('DailyFuelWorkspaceService', () => {
  let service: DailyFuelWorkspaceService;
  let repository: DailyFuelWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DailyFuelMap,
        DailyFuelWorkspaceService,
        DailyFuelWorkspaceRepository,
      ],
    }).compile();

    service = module.get<DailyFuelWorkspaceService>(DailyFuelWorkspaceService);
    repository = module.get(DailyFuelWorkspaceRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('import', () => {
    it('should import a record', async function() {
      const dailyFuel = genDailyFuel<DailyFuel>()[0];

      // @ts-expect-error use as mock
      jest.spyOn(repository, 'create').mockResolvedValue(dailyFuel);
      jest.spyOn(repository, 'save').mockResolvedValue(dailyFuel);

      await expect(
        service.import({
          ...dailyFuel,
          reportingPeriodId: faker.datatype.number(),
          monitoringLocationId: faker.datatype.string(),
          identifiers: {
            components: {},
            monitoringSystems: {},
            monitorFormulas: {},
          },
        }),
      ).resolves.toEqual(dailyFuel);
    });
  });
});
