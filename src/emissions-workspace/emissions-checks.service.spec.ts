import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { WeeklyTestSummaryCheckService } from '../weekly-test-summary-workspace/weekly-test-summary-check.service';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { EmissionsChecksService } from './emissions-checks.service';
import { WeeklyTestSummaryDTO } from '../dto/weekly-test-summary.dto';
import { IMPORT_CHECK_ERROR } from '../utils/error.const';

describe('Emissions Checks Service Tests', () => {
  let service: EmissionsChecksService;
  let wtsChecksService: WeeklyTestSummaryCheckService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        EmissionsChecksService,
        {
          provide: WeeklyTestSummaryCheckService,
          useFactory: () => ({
            runChecks: jest.fn().mockReturnValue([]),
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

      expect(service.invalidDatesCheck(payload)).toEqual([
        IMPORT_CHECK_ERROR.IMPORT_23,
      ]);

      // Payload date is less than lowest date in data
      payload.year = today.getFullYear() - 3;

      expect(service.invalidDatesCheck(payload)).toEqual([
        IMPORT_CHECK_ERROR.IMPORT_23,
      ]);

      payload.year;
    });
  });
});
