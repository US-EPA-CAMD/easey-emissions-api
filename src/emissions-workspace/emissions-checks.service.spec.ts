import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { WeeklyTestSummaryCheckService } from '../weekly-test-summary-workspace/weekly-test-summary-check.service';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { EmissionsChecksService } from './emissions-checks.service';
import { WeeklyTestSummaryDTO } from '../dto/weekly-test-summary.dto';
import { MonitorLocationChecksService } from '../monitor-location-workspace/monitor-location-checks.service';
import { DailyTestSummaryMap } from '../maps/daily-test-summary.map';
import { DailyTestSummaryWorkspaceService } from '../daily-test-summary-workspace/daily-test-summary.service';
import { DailyTestSummaryWorkspaceRepository } from '../daily-test-summary-workspace/daily-test-summary.repository';
import { DailyCalibrationWorkspaceService } from '../daily-calibration-workspace/daily-calibration.service';
import { DailyCalibrationMap } from '../maps/daily-calibration.map';
import { DailyCalibrationWorkspaceRepository } from '../daily-calibration-workspace/daily-calibration.repository';
import { DailyTestSummaryCheckService } from '../daily-test-summary-workspace/daily-test-summary-check.service';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

describe('Emissions Checks Service Tests', () => {
  let service: EmissionsChecksService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        DailyCalibrationMap,
        DailyCalibrationWorkspaceService,
        DailyTestSummaryMap,
        DailyTestSummaryCheckService,
        DailyTestSummaryWorkspaceService,
        EmissionsChecksService,
        {
          provide: DailyCalibrationWorkspaceRepository,
          useValue: () => jest,
        },
        {
          provide: DailyTestSummaryWorkspaceRepository,
          useValue: () => jest,
        },
        {
          provide: WeeklyTestSummaryCheckService,
          useFactory: () => ({
            runChecks: jest.fn().mockReturnValue([]),
          }),
        },
        {
          provide: MonitorLocationChecksService,
          useFactory: () => ({
            runChecks: jest.fn().mockResolvedValue([[], []]),
          }),
        },
      ],
    }).compile();

    service = module.get(EmissionsChecksService);
  });

  describe('test runChecks()', () => {
    it('should run successfully', () => {
      const emissionsPayload = new EmissionsImportDTO();
      const result = service.runChecks(emissionsPayload);

      expect(typeof result).not.toBeNull();
    });
  });

  describe('invalidDatesCheck', () => {
    it('should return empty array for empty DTO', function() {
      const payload = new EmissionsImportDTO();

      const result = service.invalidDatesCheck(payload);
      expect(result).toEqual([]);
    });

    it('should return empty array for valid dates', function() {
      const payload = new EmissionsImportDTO();
      const weeklyTestSummaryData = [new WeeklyTestSummaryDTO()];

      const today = new Date();
      payload.year = today.getFullYear();
      payload.quarter = Math.floor(today.getMonth() / 3 + 1);
      payload.weeklyTestSummaryData = weeklyTestSummaryData;
      payload.weeklyTestSummaryData[0].date = new Date();

      expect(service.invalidDatesCheck(payload)).toEqual([]);
    });

    it('should return error for invalid dates', function() {
      const payload = new EmissionsImportDTO();
      const weeklyTestSummaryData = [new WeeklyTestSummaryDTO()];

      // Payload date is greater than highest date in data
      const today = new Date();
      payload.year = today.getFullYear();
      payload.quarter = Math.floor(today.getMonth() / 3 + 1) + 1;
      payload.weeklyTestSummaryData = weeklyTestSummaryData;
      payload.weeklyTestSummaryData[0].date = new Date();

      const message =
        '[IMPORT-23] You have reported a date in a Daily Summary, DailyTest Summary or Hourly Operating record that does not fall within the reporting period. The emissions file will not be imported.';
      CheckCatalogService.formatResultMessage = () => message;
      expect(service.invalidDatesCheck(payload)).toEqual([message]);

      // Payload date is less than lowest date in data
      payload.year = today.getFullYear() - 3;

      expect(service.invalidDatesCheck(payload)).toEqual([message]);

      payload.year;
    });
  });
});
