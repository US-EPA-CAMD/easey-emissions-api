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
import { HourlyGasFlowMeterMap } from '../maps/hourly-gas-flow-meter.map';
import { HourlyGasFlowMeterService } from '../hourly-gas-flow-meter/hourly-gas-flow-meter.service';
import { HourlyGasFlowMeterRepository } from '../hourly-gas-flow-meter/hourly-gas-flow-meter.repository';
import { HourlyFuelFlowService } from '../hourly-fuel-flow/hourly-fuel-flow.service';
import { HourlyFuelFlowRepository } from '../hourly-fuel-flow/hourly-fuel-flow.repository';
import { HourlyFuelFlowMap } from '../maps/hourly-fuel-flow-map';
import { HourlyParameterFuelFlowService } from '../hourly-parameter-fuel-flow/hourly-parameter-fuel-flow.service';
import { HourlyParameterFuelFlowRepository } from '../hourly-parameter-fuel-flow/hourly-parameter-fuel-flow.repository';
import { HourlyParameterFuelFlowMap } from '../maps/hourly-parameter-fuel-flow.map';
import { DailyEmissionService } from '../daily-emission/daily-emission.service';
import { DailyEmissionMap } from '../maps/daily-emission.map';
import { DailyEmissionRepository } from '../daily-emission/daily-emission.repository';
import { DailyFuelService } from '../daily-fuel/daily-fuel.service';
import { DailyFuelMap } from '../maps/daily-fuel.map';
import { DailyFuelRepository } from '../daily-fuel/daily-fuel.repository';
import { SorbentTrapService } from '../sorbent-trap/sorbent-trap.service';
import { SamplingTrainService } from '../sampling-train/sampling-train.service';
import { SamplingTrainRepository } from '../sampling-train/sampling-train.repository';
import { SorbentTrapRepository } from '../sorbent-trap/sorbent-trap.repository';
import { WeeklyTestSummaryService } from '../weekly-test-summary/weekly-test-summary.service';
import { WeeklyTestSummaryRepository } from '../weekly-test-summary/weekly-test-summary.repository';
import { WeeklyTestSummaryMap } from '../maps/weekly-test-summary.map';
import { WeeklySystemIntegrityService } from '../weekly-system-integrity/weekly-system-integrity.service';
import { WeeklySystemIntegrityMap } from '../maps/weekly-system-integrity.map';
import { WeeklySystemIntegrityRepository } from '../weekly-system-integrity/weekly-system-integrity.repository';
import { Nsps4tSummaryService } from '../nsps4t-summary/nsps4t-summary.service';
import { Nsps4tSummaryRepository } from '../nsps4t-summary/nsps4t-summary.repository';
import { Nsps4tAnnualService } from '../nsps4t-annual/nsps4t-annual.service';
import { Nsps4tAnnualRepository } from '../nsps4t-annual/nsps4t-annual.repository';
import { Nsps4tCompliancePeriodService } from '../nsps4t-compliance-period/nsps4t-compliance-period.service';
import { Nsps4tCompliancePeriodRepository } from '../nsps4t-compliance-period/nsps4t-compliance-period.repository';
import { SummaryValueService } from '../summary-value/summary-value.service';
import { SummaryValueRepository } from '../summary-value/summary-value.repository';
import { SummaryValueMap } from '../maps/summary-value.map';
import { ReviewSubmitService } from '../emissions-workspace/ReviewSubmit.service';
import { LongTermFuelFlowService } from '../long-term-fuel-flow/long-term-fuel-flow.service';
import { LongTermFuelFlowRepository } from '../long-term-fuel-flow/long-term-fuel-flow.repository';

describe('-- Emissions Controller --', () => {
  let controller: EmissionsController;
  let service: EmissionsService;
  let submissionService: ReviewSubmitService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [EmissionsController],
      providers: [
        DerivedHourlyValueMap,
        DerivedHourlyValueService,
        DerivedHourlyValueRepository,
        EmissionsService,
        DailyEmissionService,
        DailyEmissionMap,
        DailyEmissionRepository,
        DailyFuelService,
        DailyFuelMap,
        DailyFuelRepository,
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
        Nsps4tAnnualService,
        Nsps4tAnnualRepository,
        Nsps4tCompliancePeriodService,
        Nsps4tCompliancePeriodRepository,
        Nsps4tSummaryService,
        Nsps4tSummaryRepository,
        EmissionsSubmissionsProgressRepository,
        EmissionsRepository,
        HourlyGasFlowMeterMap,
        HourlyGasFlowMeterService,
        HourlyGasFlowMeterRepository,
        HourlyFuelFlowService,
        HourlyFuelFlowRepository,
        HourlyFuelFlowMap,
        HourlyParameterFuelFlowService,
        HourlyParameterFuelFlowRepository,
        HourlyParameterFuelFlowMap,
        SorbentTrapRepository,
        SorbentTrapService,
        SamplingTrainRepository,
        SamplingTrainService,
        WeeklyTestSummaryService,
        WeeklyTestSummaryRepository,
        WeeklyTestSummaryMap,
        WeeklySystemIntegrityService,
        WeeklySystemIntegrityMap,
        WeeklySystemIntegrityRepository,
        SummaryValueMap,
        SummaryValueRepository,
        SummaryValueService,
        LongTermFuelFlowService,
        LongTermFuelFlowRepository
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
