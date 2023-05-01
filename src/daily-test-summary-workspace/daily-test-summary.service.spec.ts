import { Test, TestingModule } from '@nestjs/testing';
import { DailyCalibrationMap } from '../maps/daily-calibration.map';
import {
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
import { genEmissionsParamsDto } from '../../test/object-generators/emissions-dto';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { DailyTestSummaryImportDTO } from '../dto/daily-test-summary.dto';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { MonitorLocation } from '../entities/monitor-location.entity';

const writeObjectMock = jest.fn();

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
        {
          provide: BulkLoadService,
          useFactory: () => ({
            startBulkLoader: jest.fn().mockResolvedValue({
              writeObject: writeObjectMock,
              complete: jest.fn(),
              finished: true,
            }),
          }),
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
    jest.spyOn(repository, 'delete').mockResolvedValue(undefined);

    await expect(
      dailyTestSummaryService.getDailyTestSummariesByLocationIds(
        mockedValues.map(value => {
          return value.monitorLocation.id;
        }),
        genEmissionsParamsDto()[0],
      ),
    ).resolves.toEqual(mappedValues);
  });

  it('should delete a record', async function() {
    await expect(
      dailyTestSummaryService.delete({
        monitoringLocationId: '123',
        reportingPeriodId: 2,
      }),
    ).resolves.toEqual(undefined);
  });

  it('should export mapped data', async function() {
    const dailyTestSummaryMocks = genDailyTestSummary<DailyTestSummary>(3);
    const mappedValues = await map.many(dailyTestSummaryMocks);

    jest.spyOn(repository, 'export').mockResolvedValue(dailyTestSummaryMocks);
    jest
      .spyOn(dailyCalibrationWorkspaceRepository, 'find')
      .mockResolvedValue(null);

    await expect(
      dailyTestSummaryService.export([], genEmissionsParamsDto()[0]),
    ).resolves.toEqual(mappedValues);
  });

  it('should successfully import', async function() {
    const emissionsDto = new EmissionsImportDTO();
    emissionsDto.dailyTestSummaryData = [
      new DailyTestSummaryImportDTO(),
      new DailyTestSummaryImportDTO(),
      new DailyTestSummaryImportDTO(),
    ];

    await dailyTestSummaryService.import(emissionsDto, [new MonitorLocation], 1, {
      components: {},
      monitorFormulas: {},
      monitoringSystems: {},
      userId: '',
    });

    expect(writeObjectMock).toHaveBeenCalledTimes(3);
  });
});
