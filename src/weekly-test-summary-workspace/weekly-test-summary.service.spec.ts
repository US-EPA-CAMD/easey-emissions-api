import { faker } from '@faker-js/faker';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { EntityManager } from 'typeorm';

import { mockWeeklyTestSummaryWorkspaceRepository } from '../../test/mocks/mock-weekly-test-summary-workspace-repository';
import { genWeeklyTestSumValues } from '../../test/object-generators/weekly-test-summary';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { WeeklyTestSummary } from '../entities/workspace/weekly-test-summary.entity';
import { WeeklySystemIntegrityMap } from '../maps/weekly-system-integrity.map';
import { WeeklyTestSummaryMap } from '../maps/weekly-test-summary.map';
import { WeeklySystemIntegrityWorkspaceRepository } from '../weekly-system-integrity-workspace/weekly-system-integrity.repository';
import { WeeklySystemIntegrityWorkspaceService } from '../weekly-system-integrity-workspace/weekly-system-integrity.service';
import { WeeklyTestSummaryWorkspaceRepository } from './weekly-test-summary.repository';
import { WeeklyTestSummaryWorkspaceService } from './weekly-test-summary.service';

describe('--WeeklyTestSummaryWorkspaceService--', () => {
  let map: WeeklyTestSummaryMap;
  let repository: WeeklyTestSummaryWorkspaceRepository;
  let weeklySystemIntegrityService: WeeklySystemIntegrityWorkspaceService;
  let service: WeeklyTestSummaryWorkspaceService;
  let bulkLoadService: BulkLoadService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EntityManager,
        WeeklyTestSummaryMap,
        WeeklyTestSummaryWorkspaceService,
        WeeklySystemIntegrityWorkspaceService,
        WeeklySystemIntegrityMap,
        WeeklySystemIntegrityWorkspaceRepository,
        BulkLoadService,
        ConfigService,
        {
          provide: WeeklyTestSummaryWorkspaceRepository,
          useValue: mockWeeklyTestSummaryWorkspaceRepository,
        },
      ],
    }).compile();

    map = module.get(WeeklyTestSummaryMap);
    repository = module.get(WeeklyTestSummaryWorkspaceRepository);
    service = module.get(WeeklyTestSummaryWorkspaceService);
    bulkLoadService = module.get(BulkLoadService);
    weeklySystemIntegrityService = module.get(
      WeeklySystemIntegrityWorkspaceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('export', () => {
    it('returns export record for weekly test summary data', async () => {
      const mockedValues = genWeeklyTestSumValues<WeeklyTestSummary>(3, {
        include: ['weeklySystemIntegrityData'],
      });
      const promises = [];
      const params = new EmissionsParamsDTO();
      mockedValues.forEach(value => {
        promises.push(map.one(value));
      });
      const mappedValues = await Promise.all(promises);
      jest.spyOn(repository, 'export').mockResolvedValue(mockedValues);
      jest
        .spyOn(weeklySystemIntegrityService, 'export')
        .mockResolvedValue(undefined);

      await expect(
        service.export(
          mockedValues.map(value => {
            return value.id;
          }),
          params,
        ),
      ).resolves.toEqual(mappedValues);
    });
  });

  describe('import', () => {
    it('should successfully import a weekly test summary record', async () => {
      const generatedData = genWeeklyTestSumValues<WeeklyTestSummary>(1, {
        include: ['weeklySystemIntegrityData'],
      });
      const importData = await map.many(generatedData);

      // @ts-expect-error use as mock
      jest.spyOn(bulkLoadService, 'startBulkLoader').mockResolvedValue({
        writeObject: jest.fn(),
        complete: jest.fn(),
        finished: Promise.resolve(true),
      });

      jest
        .spyOn(weeklySystemIntegrityService, 'import')
        .mockResolvedValue(null);
      const emissionsDto = new EmissionsImportDTO();
      emissionsDto.weeklyTestSummaryData = importData;

      const locations = [{ unit: { name: 'a' }, id: 1 }];
      importData[0].unitId = 'a';
      const identifiers = { locations: {}, userId: '' };
      const monitoringLocationId = faker.datatype.string();
      identifiers.locations[monitoringLocationId] = {
        components: {},
        monitorFormulas: {},
        monitoringSystems: {},
      };

      await expect(service.import(emissionsDto, locations, '', identifiers, ''))
        .resolves;
    });
  });
});
