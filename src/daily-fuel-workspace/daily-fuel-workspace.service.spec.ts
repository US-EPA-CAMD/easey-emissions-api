import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { EntityManager } from 'typeorm';

import { genDailyFuel } from '../../test/object-generators/daily-fuel';
import { DailyFuel } from '../entities/workspace/daily-fuel.entity';
import { DailyFuelMap } from '../maps/daily-fuel.map';
import { DailyFuelWorkspaceRepository } from './daily-fuel-workspace.repository';
import { DailyFuelWorkspaceService } from './daily-fuel-workspace.service';

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
        EntityManager,
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
        writeObject: jest.fn(),
        complete: jest.fn(),
        finished: Promise.resolve(true),
      });

      await expect(service.import(dailyFuel)).resolves;
    });
  });
});
