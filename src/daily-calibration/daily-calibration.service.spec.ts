import { Test } from '@nestjs/testing';

import { DailyCalibrationService } from './daily-calibration.service';
import { DailyCalibrationMap } from '../maps/daily-calibration.map';
import { DailyCalibrationRepository } from './daily-calibration.repository';

const mockRepository = {
  export: () => null,
  find: () => null,
};
const mockMap = {
  many: () => null,
};

describe('MonitorHourlyValueService', () => {
  let service: DailyCalibrationService;
  let repository: any;
  let map;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DailyCalibrationService,
        {
          provide: DailyCalibrationMap,
          useValue: mockMap,
        },
        {
          provide: DailyCalibrationRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get(DailyCalibrationService);
    repository = module.get(DailyCalibrationRepository);
    map = module.get(DailyCalibrationMap);
  });

  describe('export', () => {
    it('service should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should export a record', async () => {
      const result = await service.export(['123']);
      expect(result).toEqual(null);
    });
  });
});
