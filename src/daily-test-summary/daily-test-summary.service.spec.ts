import { Test } from '@nestjs/testing';

import { DailyTestSummaryService } from './daily-test-summary.service';
import { DailyTestSummaryMap } from '../maps/daily-test-summary.map';
import { DailyCalibrationService } from '../daily-calibration/daily-calibration.service';
import { DailyCalibrationRepository } from '../daily-calibration/daily-calibration.repository';
import { DailyCalibrationMap } from '../maps/daily-calibration.map';
import { DailyTestSummaryRepository } from './daily-test-summary.repository';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';

const mockRepository = {
  export: () => null,
};
const mockMap = {
  many: () => null,
};

describe('HourlyOperatingService', () => {
  let service: DailyTestSummaryService;
  let repository: any;
  let map;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DailyTestSummaryService,
        DailyTestSummaryMap,
        DailyCalibrationService,
        DailyCalibrationRepository,
        DailyCalibrationMap,
        {
          provide: DailyTestSummaryMap,
          useValue: mockMap,
        },
        {
          provide: DailyTestSummaryRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get(DailyTestSummaryService);
    repository = module.get(DailyTestSummaryRepository);
    map = module.get(DailyTestSummaryMap);
  });

  describe('export', () => {
    it('service should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should export a record', async () => {
      const filters = new EmissionsParamsDTO();
      const result = await service.export(['123'], filters);
      expect(result).toEqual(null);
    });
  });
});
