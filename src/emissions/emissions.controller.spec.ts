import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { EntityManager } from 'typeorm';

import { genEmissionsRecordDto } from '../../test/object-generators/emissions-dto';
import { DailyBackstopService } from '../daily-backstop/daily-backstop.service';
import { DailyCalibrationRepository } from '../daily-calibration/daily-calibration.repository';
import { DailyCalibrationService } from '../daily-calibration/daily-calibration.service';
import { DailyEmissionRepository } from '../daily-emission/daily-emission.repository';
import { DailyEmissionService } from '../daily-emission/daily-emission.service';
import { DailyFuelRepository } from '../daily-fuel/daily-fuel.repository';
import { DailyFuelService } from '../daily-fuel/daily-fuel.service';
import { DailyTestSummaryRepository } from '../daily-test-summary/daily-test-summary.repository';
import { DailyTestSummaryService } from '../daily-test-summary/daily-test-summary.service';
import { DerivedHourlyValueRepository } from '../derived-hourly-value/derived-hourly-value.repository';
import { DerivedHourlyValueService } from '../derived-hourly-value/derived-hourly-value.service';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { ReviewSubmitService } from '../emissions-workspace/ReviewSubmit.service';
import { EmissionsSubmissionsProgress } from '../entities/vw-emissions-submissions-progress.entity';
import { HourlyFuelFlowRepository } from '../hourly-fuel-flow/hourly-fuel-flow.repository';
import { HourlyFuelFlowService } from '../hourly-fuel-flow/hourly-fuel-flow.service';
import { HourlyGasFlowMeterRepository } from '../hourly-gas-flow-meter/hourly-gas-flow-meter.repository';
import { HourlyGasFlowMeterService } from '../hourly-gas-flow-meter/hourly-gas-flow-meter.service';
import { HourlyOperatingRepository } from '../hourly-operating/hourly-operating.repository';
import { HourlyOperatingService } from '../hourly-operating/hourly-operating.service';
import { HourlyParameterFuelFlowRepository } from '../hourly-parameter-fuel-flow/hourly-parameter-fuel-flow.repository';
import { HourlyParameterFuelFlowService } from '../hourly-parameter-fuel-flow/hourly-parameter-fuel-flow.service';
import { LongTermFuelFlowRepository } from '../long-term-fuel-flow/long-term-fuel-flow.repository';
import { LongTermFuelFlowService } from '../long-term-fuel-flow/long-term-fuel-flow.service';
import { DailyCalibrationMap } from '../maps/daily-calibration.map';
import { DailyEmissionMap } from '../maps/daily-emission.map';
import { DailyFuelMap } from '../maps/daily-fuel.map';
import { DailyTestSummaryMap } from '../maps/daily-test-summary.map';
import { DerivedHourlyValueMap } from '../maps/derived-hourly-value.map';
import { EmissionsSubmissionsProgressMap } from '../maps/emissions-submissions-progress.map';
import { EmissionsMap } from '../maps/emissions.map';
import { HourlyFuelFlowMap } from '../maps/hourly-fuel-flow-map';
import { HourlyGasFlowMeterMap } from '../maps/hourly-gas-flow-meter.map';
import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import { HourlyParameterFuelFlowMap } from '../maps/hourly-parameter-fuel-flow.map';
import { LongTermFuelFlowMap } from '../maps/long-term-fuel-flow.map';
import { MatsDerivedHourlyValueMap } from '../maps/mats-derived-hourly-value.map';
import { MatsMonitorHourlyValueMap } from '../maps/mats-monitor-hourly-value.map';
import { MonitorHourlyValueMap } from '../maps/monitor-hourly-value.map';
import { SummaryValueMap } from '../maps/summary-value.map';
import { WeeklySystemIntegrityMap } from '../maps/weekly-system-integrity.map';
import { WeeklyTestSummaryMap } from '../maps/weekly-test-summary.map';
import { MatsDerivedHourlyValueRepository } from '../mats-derived-hourly-value/mats-derived-hourly-value.repository';
import { MatsDerivedHourlyValueService } from '../mats-derived-hourly-value/mats-derived-hourly-value.service';
import { MatsMonitorHourlyValueRepository } from '../mats-monitor-hourly-value/mats-monitor-hourly-value.repository';
import { MatsMonitorHourlyValueService } from '../mats-monitor-hourly-value/mats-monitor-hourly-value.service';
import { MonitorHourlyValueRepository } from '../monitor-hourly-value/monitor-hourly-value.repository';
import { MonitorHourlyValueService } from '../monitor-hourly-value/monitor-hourly-value.service';
import { Nsps4tAnnualRepository } from '../nsps4t-annual/nsps4t-annual.repository';
import { Nsps4tAnnualService } from '../nsps4t-annual/nsps4t-annual.service';
import { Nsps4tCompliancePeriodRepository } from '../nsps4t-compliance-period/nsps4t-compliance-period.repository';
import { Nsps4tCompliancePeriodService } from '../nsps4t-compliance-period/nsps4t-compliance-period.service';
import { Nsps4tSummaryRepository } from '../nsps4t-summary/nsps4t-summary.repository';
import { Nsps4tSummaryService } from '../nsps4t-summary/nsps4t-summary.service';
import { SamplingTrainRepository } from '../sampling-train/sampling-train.repository';
import { SamplingTrainService } from '../sampling-train/sampling-train.service';
import { SorbentTrapRepository } from '../sorbent-trap/sorbent-trap.repository';
import { SorbentTrapService } from '../sorbent-trap/sorbent-trap.service';
import { SummaryValueRepository } from '../summary-value/summary-value.repository';
import { SummaryValueService } from '../summary-value/summary-value.service';
import { WeeklySystemIntegrityRepository } from '../weekly-system-integrity/weekly-system-integrity.repository';
import { WeeklySystemIntegrityService } from '../weekly-system-integrity/weekly-system-integrity.service';
import { WeeklyTestSummaryRepository } from '../weekly-test-summary/weekly-test-summary.repository';
import { WeeklyTestSummaryService } from '../weekly-test-summary/weekly-test-summary.service';
import { EmissionsSubmissionsProgressRepository } from './emissions-submissions-progress.repository';
import { EmissionsController } from './emissions.controller';
import { EmissionsRepository } from './emissions.repository';
import { EmissionsService } from './emissions.service';
import { EaseyContentService } from '../emissions-easey-content/easey-content.service';

jest.mock('../emissions-workspace/ReviewSubmit.service');

describe('-- Emissions Controller --', () => {
  let controller: EmissionsController;
  let service: EmissionsService;
  let submissionService: ReviewSubmitService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [EmissionsController],
      providers: [
        EaseyContentService,
        EntityManager,
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
        LongTermFuelFlowRepository,
        LongTermFuelFlowMap,
        ReviewSubmitService,
        {
          provide: DailyBackstopService,
          useValue: jest.mock('../daily-backstop/daily-backstop.service'),
        },
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
      const mockedValues = genEmissionsRecordDto(1);
      console.log(mockedValues[0]);
      jest.spyOn(service, 'export').mockResolvedValue(mockedValues[0]);
      expect(await controller.export(params)).toBe(mockedValues[0]);
    });
  });
});
