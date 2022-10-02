import { Test, TestingModule } from '@nestjs/testing';
import { DailyEmissionWorkspaceService } from './daily-emission-workspace.service';
import { DailyEmissionWorkspaceRepository } from './daily-emission-workspace.repository';
import { DailyFuelWorkspaceService } from '../daily-fuel-workspace/daily-fuel-workspace.service';
import { DailyFuelWorkspaceRepository } from '../daily-fuel-workspace/daily-fuel-workspace.repository';
import { genDailyEmission } from '../../test/object-generators/daily-emission';
import { DailyEmission } from '../entities/workspace/daily-emission.entity';
import { faker } from '@faker-js/faker';
import { DailyEmissionMap } from '../maps/daily-emission.map';
import { DailyFuelMap } from '../maps/daily-fuel.map';

describe('DailyEmissionWorkspaceService', () => {
  let service: DailyEmissionWorkspaceService;
  let repository: DailyEmissionWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DailyFuelMap,
        DailyEmissionMap,
        DailyEmissionWorkspaceService,
        DailyEmissionWorkspaceRepository,
        DailyFuelWorkspaceService,
        DailyFuelWorkspaceRepository,
      ],
    }).compile();

    service = module.get<DailyEmissionWorkspaceService>(
      DailyEmissionWorkspaceService,
    );
    repository = module.get(DailyEmissionWorkspaceRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('import', () => {
    it('should import a record', async function() {
      const dailyEmission = genDailyEmission<DailyEmission>(1)[0];

      // @ts-expect-error use as mock
      jest.spyOn(repository, 'create').mockResolvedValue(dailyEmission);
      jest.spyOn(repository, 'save').mockResolvedValue(dailyEmission);

      await expect(
        service.import({
          ...dailyEmission,
          reportingPeriodId: faker.datatype.number(),
          monitoringLocationId: faker.datatype.string(),
          identifiers: {
            components: {},
            monitorFormulas: {},
            monitoringSystems: {},
          },
        }),
      ).resolves.toEqual(dailyEmission);
    });
  });
});
