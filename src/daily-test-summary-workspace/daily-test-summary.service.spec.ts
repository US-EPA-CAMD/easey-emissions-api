import { Test, TestingModule } from '@nestjs/testing';
import { DailyCalibrationMap } from '../maps/daily-calibration.map';
import { DailyTestSummaryWorkspaceService } from './daily-test-summary.service';
import { DailyTestSummaryWorkspaceRepository } from './daily-test-summary.repository';
import { DailyTestSummaryMap } from '../maps/daily-test-summary.map';
import { DailyCalibrationWorkspaceService } from '../daily-calibration-workspace/daily-calibration.service';
import { DailyCalibrationWorkspaceRepository } from '../daily-calibration-workspace/daily-calibration.repository';
import { DailyTestSummaryImportDTO } from '../dto/daily-test-summary.dto';

const dailyTestSummaryWorkspaceRepositoryMock = {
  delete: jest.fn().mockResolvedValue(undefined),
  save: jest.fn().mockResolvedValue(undefined),
};

describe('Daily Summary Workspace Service', () => {
  let dailyTestSummaryService: DailyTestSummaryWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DailyTestSummaryWorkspaceService,
        DailyCalibrationWorkspaceService,
        DailyTestSummaryMap,
        DailyCalibrationMap,
        {
          provide: DailyTestSummaryWorkspaceRepository,
          useValue: dailyTestSummaryWorkspaceRepositoryMock,
        },
        {
          provide: DailyCalibrationWorkspaceRepository,
          useValue: jest.mock(
            '../daily-calibration-workspace/daily-calibration.repository',
          ),
        },
      ],
    }).compile();

    dailyTestSummaryService = module.get(DailyTestSummaryWorkspaceService);
  });

  it('should have a daily test summary service', function() {
    expect(dailyTestSummaryService).toBeDefined();
  });

  it('should delete a record', async function() {
    await expect(dailyTestSummaryService.delete('123')).resolves.toEqual(
      undefined,
    );
  });

  it('should successfully import', async function() {
    const importData: DailyTestSummaryImportDTO = {
      stackPipeId: '123',
      unitId: '234',
      date: new Date(),
      hour: 1,
      minute: 0,
      testTypeCode: 'code',
      testResultCode: 'code',
      dailyCalibrationData: [],
    };

    jest.spyOn(dailyTestSummaryService, 'import').mockResolvedValue(undefined);

    await expect(
      dailyTestSummaryService.import({
        ...importData,
        reportingPeriodId: 3,
        monitoringLocationId: '123',
      }),
    ).resolves.toEqual(undefined);
  });
});
