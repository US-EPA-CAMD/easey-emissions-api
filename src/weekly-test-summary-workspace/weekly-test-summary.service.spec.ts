import { Test } from '@nestjs/testing';

import { WeeklyTestSummaryMap } from '../maps/weekly-test-summary.map';
import { WeeklyTestSummaryWorkspaceRepository } from './weekly-test-summary.repository';
import {
  WeeklyTestSummaryWorkspaceService,
  WeeklyTestSummaryCreate,
} from './weekly-test-summary.service';
import { genWeeklyTestSumValues } from '../../test/object-generators/weekly-test-summary';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { WeeklySystemIntegrityMap } from '../maps/weekly-system-integrity.map';
import { WeeklySystemIntegrityWorkspaceRepository } from '../weekly-system-integrity-workspace/weekly-system-integrity.repository';
import { WeeklySystemIntegrityWorkspaceService } from '../weekly-system-integrity-workspace/weekly-system-integrity.service';
import { mockWeeklyTestSummaryWorkspaceRepository } from '../../test/mocks/mock-weekly-test-summary-workspace-repository';
import { WeeklyTestSummary } from '../entities/workspace/weekly-test-summary.entity';

describe('--WeeklyTestSummaryWorkspaceService--', () => {
  let map: WeeklyTestSummaryMap;
  let repository: WeeklyTestSummaryWorkspaceRepository;
  let weeklySystemIntegrityService: WeeklySystemIntegrityWorkspaceService;
  let service: WeeklyTestSummaryWorkspaceService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        WeeklyTestSummaryMap,
        WeeklyTestSummaryWorkspaceService,
        WeeklySystemIntegrityWorkspaceService,
        WeeklySystemIntegrityMap,
        WeeklySystemIntegrityWorkspaceRepository,
        {
          provide: WeeklyTestSummaryWorkspaceRepository,
          useValue: mockWeeklyTestSummaryWorkspaceRepository,
        },
      ],
    }).compile();

    map = module.get(WeeklyTestSummaryMap);
    repository = module.get(WeeklyTestSummaryWorkspaceRepository);
    service = module.get(WeeklyTestSummaryWorkspaceService);
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
      const generatedData = genWeeklyTestSumValues<WeeklyTestSummary>(1);

      const mappedMock = await map.one(generatedData[0]);

      jest.spyOn(repository, 'save').mockResolvedValue(generatedData[0]);
      jest.spyOn(service, 'delete').mockResolvedValue(undefined);
      await expect(
        service.import(
          (generatedData[0] as unknown) as WeeklyTestSummaryCreate,
        ),
      ).resolves.toEqual(mappedMock);
    });
  });
});
