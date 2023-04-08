import { Test } from '@nestjs/testing';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { EmissionsWorkspaceController } from './emissions.controller';
import { EmissionsWorkspaceService } from './emissions.service';
import { EmissionsDTO, EmissionsImportDTO } from '../dto/emissions.dto';
import { EmissionsSubmissionsProgressMap } from '../maps/emissions-submissions-progress.map';
import { EmissionsMap } from '../maps/emissions.map';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { DailyEmissionMap } from '../maps/daily-emission.map';
import { DailyFuelMap } from '../maps/daily-fuel.map';
import { DailyEmissionWorkspaceService } from '../daily-emission-workspace/daily-emission-workspace.service';
import { DailyFuelWorkspaceService } from '../daily-fuel-workspace/daily-fuel-workspace.service';
import { DailyTestSummaryCheckService } from '../daily-test-summary-workspace/daily-test-summary-check.service';
import { EmissionsChecksService } from './emissions-checks.service';
import { MonitorPlanChecksService } from '../monitor-plan-workspace/monitor-plan-checks.service';
import { Nsps4tAnnualWorkspaceService } from '../nsps4t-annual-workspace/nsps4t-annual-workspace.service';
import { Nsps4tCompliancePeriodWorkspaceService } from '../nsps4t-compliance-period-workspace/nsps4t-compliance-period-workspace.service';
import { Nsps4tSummaryWorkspaceService } from '../nsps4t-summary-workspace/nsps4t-summary-workspace.service';
import { SamplingTrainWorkspaceService } from '../sampling-train-workspace/sampling-train-workspace.service';
import { SorbentTrapWorkspaceService } from '../sorbent-trap-workspace/sorbent-trap-workspace.service';
import { DailyEmissionWorkspaceRepository } from '../daily-emission-workspace/daily-emission-workspace.repository';
import { DailyFuelWorkspaceRepository } from '../daily-fuel-workspace/daily-fuel-workspace.repository';
import { ComponentRepository } from '../component/component.repository';
import { MonitorFormulaRepository } from '../monitor-formula/monitor-formula.repository';
import { MonitorPlanWorkspaceRepository } from '../monitor-plan-workspace/monitor-plan-repository';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { Nsps4tAnnualWorkspaceRepository } from '../nsps4t-annual-workspace/nsps4t-annual-workspace.repository';
import { Nsps4tCompliancePeriodWorkspaceRepository } from '../nsps4t-compliance-period-workspace/nsps4t-compliance-period-workspace.repository';
import { Nsps4tSummaryWorkspaceRepository } from '../nsps4t-summary-workspace/nsps4t-summary-workspace.repository';
import { PlantRepository } from '../plant/plant.repository';
import { SamplingTrainWorkspaceRepository } from '../sampling-train-workspace/sampling-train-workspace.repository';
import { SorbentTrapWorkspaceRepository } from '../sorbent-trap-workspace/sorbent-trap-workspace.repository';
import { EmissionsWorkspaceRepository } from './emissions.repository';
import { DailyTestSummaryWorkspaceService } from '../daily-test-summary-workspace/daily-test-summary.service';
import { HourlyOperatingWorkspaceService } from '../hourly-operating-workspace/hourly-operating.service';
import { MonitorLocationChecksService } from '../monitor-location-workspace/monitor-location-checks.service';
import { WeeklyTestSummaryWorkspaceService } from '../weekly-test-summary-workspace/weekly-test-summary.service';
import { HourlyFuelFlowWorkspaceService } from '../hourly-fuel-flow-workspace/hourly-fuel-flow-workspace.service';
import { SummaryValueWorkspaceService } from '../summary-value-workspace/summary-value.service';
import { WeeklyTestSummaryCheckService } from '../weekly-test-summary-workspace/weekly-test-summary-check.service';
import { DailyTestSummaryMap } from '../maps/daily-test-summary.map';
import { DailyTestSummaryWorkspaceRepository } from '../daily-test-summary-workspace/daily-test-summary.repository';
import { HourlyOperatingWorkspaceRepository } from '../hourly-operating-workspace/hourly-operating.repository';
import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import { WeeklyTestSummaryWorkspaceRepository } from '../weekly-test-summary-workspace/weekly-test-summary.repository';
import { WeeklyTestSummaryMap } from '../maps/weekly-test-summary.map';
import { HourlyFuelFlowWorkspaceRepository } from '../hourly-fuel-flow-workspace/hourly-fuel-flow-workspace.repository';
import { HourlyFuelFlowMap } from '../maps/hourly-fuel-flow-map';
import { SummaryValueWorkspaceRepository } from '../summary-value-workspace/summary-value.repository';
import { SummaryValueMap } from '../maps/summary-value.map';
import { DailyCalibrationWorkspaceService } from '../daily-calibration-workspace/daily-calibration.service';
import { DailyCalibrationWorkspaceRepository } from '../daily-calibration-workspace/daily-calibration.repository';
import { DailyCalibrationMap } from '../maps/daily-calibration.map';
import { MonitorHourlyValueWorkspaceService } from '../monitor-hourly-value-workspace/monitor-hourly-value.service';
import { MonitorHourlyValueWorkspaceRepository } from '../monitor-hourly-value-workspace/monitor-hourly-value.repository';
import { MonitorHourlyValueMap } from '../maps/monitor-hourly-value.map';
import { DerivedHourlyValueWorkspaceService } from '../derived-hourly-value-workspace/derived-hourly-value-workspace.service';
import { DerivedHourlyValueWorkspaceRepository } from '../derived-hourly-value-workspace/derived-hourly-value-workspace.repository';
import { DerivedHourlyValueMap } from '../maps/derived-hourly-value.map';
import { MatsMonitorHourlyValueWorkspaceService } from '../mats-monitor-hourly-value-workspace/mats-monitor-hourly-value.service';
import { MatsMonitorHourlyValueWorkspaceRepository } from '../mats-monitor-hourly-value-workspace/mats-monitor-hourly-value.repository';
import { MatsMonitorHourlyValueMap } from '../maps/mats-monitor-hourly-value.map';
import { MatsDerivedHourlyValueWorkspaceService } from '../mats-derived-hourly-value-workspace/mats-derived-hourly-value.service';
import { MatsDerivedHourlyValueMap } from '../maps/mats-derived-hourly-value.map';
import { HourlyGasFlowMeterWorkspaceRepository } from '../hourly-gas-flow-meter-workspace/hourly-gas-flow-meter.repository';
import { HourlyGasFlowMeterMap } from '../maps/hourly-gas-flow-meter.map';
import { HourlyGasFlowMeterWorkspaceService } from '../hourly-gas-flow-meter-workspace/hourly-gas-flow-meter.service';
import { MonitorLocationWorkspaceRepository } from '../monitor-location-workspace/monitor-location.repository';
import { WeeklySystemIntegrityMap } from '../maps/weekly-system-integrity.map';
import { WeeklySystemIntegrityWorkspaceRepository } from '../weekly-system-integrity-workspace/weekly-system-integrity.repository';
import { WeeklySystemIntegrityWorkspaceService } from '../weekly-system-integrity-workspace/weekly-system-integrity.service';
import { HourlyParameterFuelFlowMap } from '../maps/hourly-parameter-fuel-flow.map';
import { HourlyParameterFuelFlowWorkspaceRepository } from '../hourly-parameter-fuel-flow-workspace/hourly-parameter-fuel-flow-workspace.repository';
import { HourlyParameterFuelFlowWorkspaceService } from '../hourly-parameter-fuel-flow-workspace/hourly-parameter-fuel-flow-workspace.service';
import { MatsDerivedHourlyValueWorkspaceRepository } from '../mats-derived-hourly-value-workspace/mats-derived-hourly-value.repository';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { EmissionsReviewSubmitDTO } from '../dto/emissions-review-submit.dto';
import { ReviewAndSubmitMultipleParamsDTO } from '../dto/review-and-submit-multiple-params.dto';
import { ReviewSubmitService } from './ReviewSubmit.service';
import { EmissionsReviewSubmitRepository } from './ReviewSubmit.repository';
import { EmissionsReviewSubmitMap } from '../maps/emissions-review-submit.map';
import { LongTermFuelFlowWorkspaceRepository } from '../long-term-fuel-flow-workspace/long-term-fuel-flow.repository';
import { LongTermFuelFlowWorkspaceService } from '../long-term-fuel-flow-workspace/long-term-fuel-flow.service';
import { LongTermFuelFlowMap } from '../maps/long-term-fuel-flow.map';

describe('-- Emissions Controller --', () => {
  let controller: EmissionsWorkspaceController;
  let service: EmissionsWorkspaceService;
  let submissionService: ReviewSubmitService;
  let emissionsChecksService: EmissionsChecksService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      controllers: [EmissionsWorkspaceController],
      providers: [
        DailyEmissionWorkspaceService,
        DailyEmissionMap,
        DailyFuelMap,
        DailyFuelWorkspaceService,
        DailyTestSummaryCheckService,
        EmissionsMap,
        EmissionsWorkspaceService,
        EmissionsSubmissionsProgressMap,
        EmissionsChecksService,
        MonitorPlanChecksService,
        SorbentTrapWorkspaceService,
        SamplingTrainWorkspaceService,
        Nsps4tAnnualWorkspaceService,
        Nsps4tSummaryWorkspaceService,
        Nsps4tCompliancePeriodWorkspaceService,
        DailyEmissionWorkspaceRepository,
        DailyFuelWorkspaceRepository,
        EmissionsWorkspaceRepository,
        PlantRepository,
        MonitorFormulaRepository,
        ComponentRepository,
        MonitorSystemRepository,
        MonitorPlanWorkspaceRepository,
        SorbentTrapWorkspaceRepository,
        SamplingTrainWorkspaceRepository,
        Nsps4tSummaryWorkspaceRepository,
        Nsps4tAnnualWorkspaceRepository,
        Nsps4tCompliancePeriodWorkspaceRepository,
        DailyTestSummaryWorkspaceService,
        DailyTestSummaryMap,
        DailyTestSummaryWorkspaceRepository,
        HourlyOperatingWorkspaceService,
        HourlyOperatingWorkspaceRepository,
        HourlyOperatingMap,
        DailyEmissionWorkspaceService,
        DailyEmissionWorkspaceRepository,
        DailyEmissionMap,
        MonitorLocationChecksService,
        MonitorPlanChecksService,
        WeeklyTestSummaryWorkspaceService,
        WeeklyTestSummaryWorkspaceRepository,
        WeeklyTestSummaryMap,
        HourlyFuelFlowWorkspaceService,
        HourlyFuelFlowWorkspaceRepository,
        HourlyFuelFlowMap,
        SummaryValueWorkspaceService,
        SummaryValueWorkspaceRepository,
        SummaryValueMap,
        WeeklyTestSummaryCheckService,
        WeeklyTestSummaryWorkspaceService,
        WeeklyTestSummaryWorkspaceRepository,
        WeeklyTestSummaryMap,
        DailyCalibrationWorkspaceService,
        DailyCalibrationWorkspaceRepository,
        DailyCalibrationMap,
        MonitorHourlyValueWorkspaceService,
        MonitorHourlyValueWorkspaceRepository,
        MonitorHourlyValueMap,
        DerivedHourlyValueWorkspaceService,
        DerivedHourlyValueWorkspaceRepository,
        DerivedHourlyValueMap,
        MatsMonitorHourlyValueWorkspaceService,
        MatsMonitorHourlyValueWorkspaceRepository,
        MatsMonitorHourlyValueMap,
        MatsDerivedHourlyValueWorkspaceService,
        MatsDerivedHourlyValueMap,
        HourlyGasFlowMeterWorkspaceService,
        HourlyGasFlowMeterWorkspaceRepository,
        HourlyGasFlowMeterMap,
        HourlyGasFlowMeterWorkspaceService,
        HourlyGasFlowMeterWorkspaceRepository,
        HourlyGasFlowMeterMap,
        MonitorLocationWorkspaceRepository,
        WeeklySystemIntegrityWorkspaceService,
        WeeklySystemIntegrityWorkspaceRepository,
        WeeklySystemIntegrityMap,
        HourlyParameterFuelFlowWorkspaceService,
        HourlyParameterFuelFlowWorkspaceRepository,
        HourlyParameterFuelFlowMap,
        MatsDerivedHourlyValueWorkspaceRepository,
        ConfigService,
        ReviewSubmitService,
        EmissionsReviewSubmitRepository,
        EmissionsReviewSubmitMap,
        LongTermFuelFlowWorkspaceRepository,
        LongTermFuelFlowWorkspaceService,
        LongTermFuelFlowMap,
      ],
    }).compile();

    controller = module.get(EmissionsWorkspaceController);
    service = module.get(EmissionsWorkspaceService);
    submissionService = module.get(ReviewSubmitService);
    emissionsChecksService = module.get(EmissionsChecksService);
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

  describe('import', () => {
    it('should import a record', async () => {
      const params = new EmissionsImportDTO();
      const user = {
        userId: 'string',
        sessionId: 'string',
        expiration: 'string',
        clientIp: 'string',
        facilities: [],
        isAdmin: true,
        permissionSet: [],
      };

      jest.spyOn(service, 'import').mockResolvedValue({ message: 'success' });
      jest.spyOn(emissionsChecksService, 'runChecks').mockResolvedValue(null);
      const result = await controller.import(params, user);

      expect(result.message).toBe('success');
    });
  });

  describe('getEmissions', () => {
    it('should call the review and submit test summary controller function and return a list of dtos', async () => {
      const dto = new EmissionsReviewSubmitDTO();
      submissionService.getEmissionsRecords = jest
        .fn()
        .mockResolvedValue([dto]);

      const result = await controller.getEmissions(
        new ReviewAndSubmitMultipleParamsDTO(),
      );

      expect(result).toEqual([dto]);
    });
  });
});
