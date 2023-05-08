import { Test, TestingModule } from '@nestjs/testing';
import { DailyFuelWorkspaceService } from './daily-fuel-workspace.service';
import { DailyFuelWorkspaceRepository } from './daily-fuel-workspace.repository';
import { genDailyFuel } from '../../test/object-generators/daily-fuel';
import { DailyFuel } from '../entities/workspace/daily-fuel.entity';
import { DailyFuelMap } from '../maps/daily-fuel.map';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { ConfigService } from '@nestjs/config';

describe('DailyFuelWorkspaceService', () => {
  let service: DailyFuelWorkspaceService;
  let bulkLoadService: BulkLoadService;
  let repository: DailyFuelWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DailyFuelMap,
        DailyFuelWorkspaceService,
        DailyFuelWorkspaceRepository,
        BulkLoadService,
        ConfigService,
      ],
    }).compile();

    service = module.get<DailyFuelWorkspaceService>(DailyFuelWorkspaceService);
    repository = module.get(DailyFuelWorkspaceRepository);
    bulkLoadService = module.get(BulkLoadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('import', () => {
    it('should import a record', async function() {
      const dailyFuel = genDailyFuel<DailyFuel>();

      // @ts-expect-error use as mock
      jest.spyOn(bulkLoadService, 'startBulkLoader').mockResolvedValue({
        writeObject:jest.fn(),
        complete:jest.fn(),
        finished: Promise.resolve(true)
      });

      await expect(service.import(dailyFuel)).resolves;
    });
  });
});
