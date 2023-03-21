import { Test, TestingModule } from '@nestjs/testing';
import { DailyCalibrationMap } from '../maps/daily-calibration.map';
import { DailyCalibrationWorkspaceService } from './daily-calibration.service';
import { DailyCalibrationWorkspaceRepository } from './daily-calibration.repository';

const dailyCalibrationRepositoryMock = {
  delete: jest.fn().mockResolvedValue(undefined),
  create: jest.fn().mockResolvedValue(undefined),
  save: jest.fn().mockResolvedValue({
    id: '123',
    dailyTestSumId: '123',
  }),
};

describe('Daily Calibration Workspace Spervice', () => {
  let dailyCalibrationService: DailyCalibrationWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DailyCalibrationWorkspaceService,
        DailyCalibrationMap,
        {
          provide: DailyCalibrationWorkspaceRepository,
          useValue: dailyCalibrationRepositoryMock,
        },
      ],
    }).compile();

    dailyCalibrationService = module.get(DailyCalibrationWorkspaceService);
  });

  it('should have a daily calibration service', function() {
    expect(dailyCalibrationService).toBeDefined();
  });

  it('should delete a record', async function() {
    await expect(dailyCalibrationService.delete('-10')).resolves.toEqual(
      undefined,
    );
  });

  it('should successfully import', async function() {
    await expect(
      dailyCalibrationService.import({
        dailyTestSummaryId: '123',
        identifiers: {
          monitorFormulas: {},
          components: {},
          monitoringSystems: {},
        },
      }),
    ).resolves.toEqual({
      addDate: undefined,
      calcOnlineOfflineIndicator: undefined,
      calcUpscaleApsIndicator: undefined,
      calcUpscaleCalibrationError: undefined,
      calcZeroApsIndicator: undefined,
      calcZeroCalibrationError: undefined,
      cylinderIdentifier: undefined,
      dailyTestSumId: undefined,
      expirationDate: undefined,
      id: '123',
      injectionProtocolCode: undefined,
      onLineOffLineIndicator: undefined,
      reportingPeriodId: undefined,
      updateDate: undefined,
      upscaleAPSIndicator: undefined,
      upscaleCalibrationError: undefined,
      upscaleGasCode: undefined,
      upscaleGasTypeCode: undefined,
      upscaleInjectionDate: undefined,
      upscaleInjectionHour: undefined,
      upscaleInjectionMinute: undefined,
      upscaleMeasuredValue: undefined,
      upscaleReferenceValue: undefined,
      userId: undefined,
      vendorIdentifier: undefined,
      zeroAPSIndicator: undefined,
      zeroCalibrationError: undefined,
      zeroInjectionDate: undefined,
      zeroInjectionHour: undefined,
      zeroInjectionMinute: undefined,
      zeroMeasuredValue: undefined,
      zeroReferenceValue: undefined,
    });
  });
});
