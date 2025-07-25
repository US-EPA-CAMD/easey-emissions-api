import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { EntityManager, QueryRunner } from 'typeorm';

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
        {
          provide: EntityManager,
          useFactory: () => ({
            findOne: jest.fn(),
            query: jest.fn(),
            save: jest.fn(),
            connection: {
              createQueryRunner: jest.fn().mockReturnValue({
                connect: jest.fn(),
                startTransaction: jest.fn(),
                commitTransaction: jest.fn(),
                rollbackTransaction: jest.fn(),
                release: jest.fn(),
                manager: {
                  findOne: jest.fn(),
                  query: jest.fn(),
                  save: jest.fn(),
                },
              }),
            },
          }),
        },
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

      jest.spyOn(bulkLoadService, 'startBulkLoader').mockImplementation(
          (_tableLocation: string, _columns?: string[], _delimiter?: string) => {
            // @ts-ignore
            return Promise.resolve({
              writeObject: jest.fn(),
              complete: jest.fn(),
              finished: Promise.resolve(true),
              status: 'Complete',
            });
          }
      );

      await expect(service.import(dailyFuel)).resolves;
    });
  });
});
