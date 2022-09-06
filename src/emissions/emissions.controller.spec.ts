import { Test } from '@nestjs/testing';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { EmissionsController } from './emissions.controller';
import { EmissionsService } from './emissions.service';
import { EmissionsRepository } from './emissions.repository';
import { EmissionsDTO } from '../dto/emissions.dto';
import { EmissionsSubmissionsProgressMap } from '../maps/emissions-submissions-progress.map';
import { EmissionsSubmissionsProgressRepository } from './emissions-submissions-progress.repository';
import { ConfigService } from '@nestjs/config';
import { DailyTestSummaryService } from '../daily-test-summary/daily-test-summary.service';
import { HourlyOperatingService } from '../hourly-operating/hourly-operating.service';
import { EmissionsMap } from '../maps/emissions.map';
import { DerivedHourlyValueMap } from '../maps/derived-hourly-value.map';
import { DerivedHourlyValueService } from '../derived-hourly-value/derived-hourly-value.service';
import { DailyCalibrationService } from '../daily-calibration/daily-calibration.service';
import { DailyTestSummaryMap } from '../maps/daily-test-summary.map';
import { DailyCalibrationMap } from '../maps/daily-calibration.map';
import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import { MonitorHourlyValueMap } from '../maps/monitor-hourly-value.map';
import { EmissionsSubmissionsProgress } from '../entities/vw-emissions-submissions-progress.entity';
import { MatsMonitorHourlyValueMap } from '../maps/mats-monitor-hourly-value.map';
import { MatsMonitorHourlyValueService } from '../mats-monitor-hourly-value/mats-monitor-hourly-value.service';
import { MatsDerivedHourlyValueMap } from '../maps/mats-derived-hourly-value.map';
import { MatsDerivedHourlyValueService } from '../mats-derived-hourly-value/mats-derived-hourly-value.service';
import { MonitorHourlyValueService } from '../monitor-hourly-value/monitor-hourly-value.service';
import { DerivedHourlyValueRepository } from '../derived-hourly-value/derived-hourly-value.repository';
import { DailyTestSummaryRepository } from '../daily-test-summary/daily-test-summary.repository';
import { DailyCalibrationRepository } from '../daily-calibration/daily-calibration.repository';
import { HourlyOperatingRepository } from '../hourly-operating/hourly-operating.repository';
import { MonitorHourlyValueRepository } from '../monitor-hourly-value/monitor-hourly-value.repository';
import { MatsMonitorHourlyValueRepository } from '../mats-monitor-hourly-value/mats-monitor-hourly-value.repository';
import { MatsDerivedHourlyValueRepository } from '../mats-derived-hourly-value/mats-derived-hourly-value.repository';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';

describe('-- Emissions Controller --', () => {
  let controller: EmissionsController;
  let service: EmissionsService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [EmissionsController],
      providers: [
        DerivedHourlyValueMap,
        DerivedHourlyValueService,
        DerivedHourlyValueRepository,
        EmissionsService,
        DailyTestSummaryService,
        DailyCalibrationService,
        EmissionsMap,
        DailyTestSummaryMap,
        DailyTestSummaryRepository,
        DailyCalibrationRepository,
        DailyCalibrationMap,
        HourlyOperatingMap,
        HourlyOperatingRepository,
        MonitorHourlyValueRepository,
        HourlyOperatingRepository,
        MonitorHourlyValueMap,
        HourlyOperatingService,
        MonitorHourlyValueService,
        EmissionsSubmissionsProgress,
        EmissionsSubmissionsProgressMap,
        ConfigService,
        MatsMonitorHourlyValueMap,
        MatsMonitorHourlyValueService,
        MatsMonitorHourlyValueRepository,
        MatsDerivedHourlyValueMap,
        MatsDerivedHourlyValueService,
        MatsDerivedHourlyValueRepository,
        EmissionsSubmissionsProgressRepository,
        EmissionsRepository,
      ],
    }).compile();

    controller = module.get(EmissionsController);
    service = module.get(EmissionsService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('* export', () => {
    it('should export a record', async () => {
      const params = new EmissionsParamsDTO();
      const expectedResult = new EmissionsDTO();
      jest.spyOn(service, 'export').mockResolvedValue(expectedResult);
      expect(await controller.export(params)).toBe(expectedResult);
    });
  });
});
