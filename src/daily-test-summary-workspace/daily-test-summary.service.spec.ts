import { Test, TestingModule } from '@nestjs/testing';
import { DailyCalibrationMap } from '../maps/daily-calibration.map';
import {
  DailyTestSummaryCreate,
  DailyTestSummaryWorkspaceService,
} from './daily-test-summary.service';
import { DailyTestSummaryWorkspaceRepository } from './daily-test-summary.repository';
import { DailyTestSummaryMap } from '../maps/daily-test-summary.map';
import { DailyCalibrationWorkspaceService } from '../daily-calibration-workspace/daily-calibration.service';
import { DailyCalibrationWorkspaceRepository } from '../daily-calibration-workspace/daily-calibration.repository';
import { mockDailyTestSummaryWorkspaceRepository } from '../../test/mocks/mock-daily-test-summary-workspace-repository';
import { genDailyTestSummary } from '../../test/object-generators/daily-test-summary';
import { DailyTestSummary } from '../entities/workspace/daily-test-summary.entity';
import { mockDailyCalibrationWorkspaceRepository } from '../../test/mocks/mock-daily-calibration-workspace-repository';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';

describe('Daily Summary Workspace Service', () => {
  let dailyCalibrationWorkspaceRepository: DailyCalibrationWorkspaceRepository;
  let dailyTestSummaryService: DailyTestSummaryWorkspaceService;
  let map: DailyTestSummaryMap;
  let repository: DailyTestSummaryWorkspaceRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DailyTestSummaryWorkspaceService,
        DailyCalibrationWorkspaceService,
        DailyTestSummaryMap,
        DailyCalibrationMap,
        {
          provide: DailyTestSummaryWorkspaceRepository,
          useValue: mockDailyTestSummaryWorkspaceRepository,
        },
        {
          provide: DailyCalibrationWorkspaceRepository,
          useValue: mockDailyCalibrationWorkspaceRepository,
        },
      ],
    }).compile();

    dailyTestSummaryService = module.get(DailyTestSummaryWorkspaceService);
    map = module.get(DailyTestSummaryMap);
    repository = module.get(DailyTestSummaryWorkspaceRepository);
    dailyCalibrationWorkspaceRepository = module.get(
      DailyCalibrationWorkspaceRepository,
    );
  });

  it('should have a daily test summary service', function() {
    expect(dailyTestSummaryService).toBeDefined();
  });

  it('should get daily test summaries by location ids', async function() {
    const mockedValues = genDailyTestSummary<DailyTestSummary>(3, {
      include: ['monitorLocation'],
    });
    const promises = [];
    mockedValues.forEach(value => {
      promises.push(map.one(value));
    });
    const mappedValues = await Promise.all(promises);

    jest.spyOn(repository, 'export').mockResolvedValue(mockedValues);

    await expect(
      dailyTestSummaryService.getDailyTestSummariesByLocationIds(
        mockedValues.map(value => {
          return value.monitorLocation.id;
        }),
        new EmissionsParamsDTO(),
      ),
    ).resolves.toEqual(mappedValues);
  });

  it('should delete a record', async function() {
    await expect(dailyTestSummaryService.delete('123')).resolves.toEqual(
      undefined,
    );
  });

  it('should export mapped data', async function() {
    const dailyTestSummaryMocks = genDailyTestSummary<DailyTestSummary>(3);
    const mappedValues = await map.many(dailyTestSummaryMocks);

    jest.spyOn(repository, 'export').mockResolvedValue(dailyTestSummaryMocks);
    jest
      .spyOn(dailyCalibrationWorkspaceRepository, 'find')
      .mockResolvedValue(null);

    await expect(
      dailyTestSummaryService.export([], new EmissionsParamsDTO()),
    ).resolves.toEqual(mappedValues);
  });

  it('should successfully import', async function() {
    const importMock = genDailyTestSummary<DailyTestSummary>(1);
    importMock[0]['dailyCalibrationData'] = [];

    const mappedMock = await map.one(
      (importMock[0] as unknown) as DailyTestSummary,
    );

    jest.spyOn(repository, 'save').mockResolvedValue(importMock[0]);

    await expect(
      dailyTestSummaryService.import(
        (importMock[0] as unknown) as DailyTestSummaryCreate,
      ),
    ).resolves.toEqual(mappedMock);
  });
});
