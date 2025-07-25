import { Test } from '@nestjs/testing';

import { WeeklySystemIntegrityMap } from '../maps/weekly-system-integrity.map';
import { genWeeklySystemIntegrity } from '../../test/object-generators/weekly-system-integrity';
import { WeeklySystemIntegrityWorkspaceRepository } from './weekly-system-integrity.repository';
import { WeeklySystemIntegrityWorkspaceService } from './weekly-system-integrity.service';
import { mockWeeklySystemIntegrityWorkspaceRepository } from '../../test/mocks/mock-weekly-system-integrity-workspace-repository';
import { WeeklySystemIntegrity } from '../entities/workspace/weekly-system-integrity.entity';
import { genWeeklySystemIntegrityDto } from '../../test/object-generators/weekly-system-integrity.dto';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { ConfigService } from '@nestjs/config';
import { EntityManager, QueryRunner } from 'typeorm';

describe('--WeeklySystemIntegrityWorkspaceService--', () => {
  let map: WeeklySystemIntegrityMap;
  let repository: WeeklySystemIntegrityWorkspaceRepository;
  let service: WeeklySystemIntegrityWorkspaceService;
  let bulkLoadService: BulkLoadService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        WeeklySystemIntegrityMap,
        WeeklySystemIntegrityWorkspaceService,
        BulkLoadService,
        ConfigService,
        {
          provide: WeeklySystemIntegrityWorkspaceRepository,
          useValue: mockWeeklySystemIntegrityWorkspaceRepository,
        },
      ],
    }).compile();

    map = module.get(WeeklySystemIntegrityMap);
    repository = module.get(WeeklySystemIntegrityWorkspaceRepository);
    service = module.get(WeeklySystemIntegrityWorkspaceService);
    bulkLoadService = module.get(BulkLoadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('export', () => {
    it('returns export record for weekly system integrity data', async () => {
      const mockedValues = genWeeklySystemIntegrity<WeeklySystemIntegrity>(3);
      const promises = [];
      mockedValues.forEach(value => {
        promises.push(map.one(value));
      });
      jest.spyOn(repository, 'find').mockResolvedValue(mockedValues);
      const mappedValues = await Promise.all(promises);

      await expect(
        service.export(
          mockedValues.map(value => {
            return value.weeklyTestSumId;
          }),
        ),
      ).resolves.toEqual(mappedValues);
    });
  });

  describe('import', () => {
    it('should successfully import a weekly test summary record', async () => {
      const generatedData = genWeeklySystemIntegrityDto(1);

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

      await expect(service.import(generatedData)).resolves;
    });
  });
});
