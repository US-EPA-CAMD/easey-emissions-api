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
import { genEmissionsImportDto } from '../../test/object-generators/emissions-dto';
import { MonitorFormulaRepository } from '../monitor-formula/monitor-formula.repository';
import { MonitorPlanChecksService } from '../monitor-plan-workspace/monitor-plan-checks.service';
import { MonitorHourlyValueWorkspaceService } from '../monitor-hourly-value-workspace/monitor-hourly-value.service';
import { HourlyFuelFlowWorkspaceService } from '../hourly-fuel-flow-workspace/hourly-fuel-flow-workspace.service';
import { MonitorHourlyValueWorkspaceRepository } from '../monitor-hourly-value-workspace/monitor-hourly-value.repository';
import { HourlyFuelFlowWorkspaceRepository } from '../hourly-fuel-flow-workspace/hourly-fuel-flow-workspace.repository';
import { HourlyFuelFlowMap } from '../maps/hourly-fuel-flow-map';
import { HourlyParameterFuelFlowWorkspaceService } from '../hourly-parameter-fuel-flow-workspace/hourly-parameter-fuel-flow-workspace.service';
import { HourlyParameterFuelFlowWorkspaceRepository } from '../hourly-parameter-fuel-flow-workspace/hourly-parameter-fuel-flow-workspace.repository';
import { HourlyParameterFuelFlowMap } from '../maps/hourly-parameter-fuel-flow.map';
import { MonitorHourlyValueMap } from '../maps/monitor-hourly-value.map';
import { WeeklySystemIntegrityWorkspaceService } from '../weekly-system-integrity-workspace/weekly-system-integrity.service';
import { WeeklySystemIntegrityMap } from '../maps/weekly-system-integrity.map';
import { WeeklySystemIntegrityWorkspaceRepository } from '../weekly-system-integrity-workspace/weekly-system-integrity.repository';
import { WeeklyTestSummaryWorkspaceRepository } from '../weekly-test-summary-workspace/weekly-test-summary.repository';
import { WeeklyTestSummaryWorkspaceService } from '../weekly-test-summary-workspace/weekly-test-summary.service';
import { WeeklyTestSummaryMap } from '../maps/weekly-test-summary.map';
import { LongTermFuelFlowService } from '../long-term-fuel-flow/long-term-fuel-flow.service';
import { mockLongTermFuelFlowWorkspaceRepository } from '../../test/mocks/mock-long-term-fuel-flow-workspace-repository';
import { LongTermFuelFlowWorkspaceRepository } from '../long-term-fuel-flow-workspace/long-term-fuel-flow.repository';
import { LongTermFuelFlowMap } from '../maps/long-term-fuel-flow.map';
import { LongTermFuelFlowRepository } from '../long-term-fuel-flow/long-term-fuel-flow.repository';
import { BulkLoadModule } from '@us-epa-camd/easey-common/bulk-load';
import { MonitorLocation } from '../entities/monitor-location.entity';
import { Unit } from '../entities/unit.entity';
import { StackPipe } from '../entities/stack-pipe.entity';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions/easey.exception';
import { CodeChecksService } from '../code-checks/code-checks.service';

jest.mock('@us-epa-camd/easey-common/check-catalog');

describe('Emissions Checks Service Tests', () => {
  let service: EmissionsChecksService;
  let monitorFormulaRepository: MonitorFormulaRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, CheckCatalogService, BulkLoadModule],
      providers: [
        DailyCalibrationMap,
        DailyCalibrationWorkspaceService,
        DailyTestSummaryMap,
        DailyTestSummaryCheckService,
        DailyTestSummaryWorkspaceService,
        EmissionsChecksService,
        MonitorPlanChecksService,
        MonitorFormulaRepository,
        MonitorHourlyValueWorkspaceService,
        HourlyFuelFlowWorkspaceService,
        MonitorHourlyValueWorkspaceRepository,
        HourlyFuelFlowWorkspaceRepository,
        HourlyFuelFlowMap,
        HourlyParameterFuelFlowWorkspaceService,
        HourlyParameterFuelFlowWorkspaceRepository,
        HourlyParameterFuelFlowMap,
        MonitorHourlyValueMap,
        WeeklyTestSummaryWorkspaceRepository,
        WeeklyTestSummaryWorkspaceService,
        WeeklySystemIntegrityWorkspaceService,
        WeeklySystemIntegrityMap,
        WeeklySystemIntegrityWorkspaceRepository,
        WeeklyTestSummaryMap,
        LongTermFuelFlowService,
        LongTermFuelFlowMap,
        LongTermFuelFlowRepository,
        {
          provide: LongTermFuelFlowWorkspaceRepository,
          useValue: mockLongTermFuelFlowWorkspaceRepository,
        },
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
          provide: CodeChecksService,
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
        {
          provide: MonitorPlanChecksService,
          useFactory: () => ({
            runChecks: jest.fn().mockResolvedValue([]),
          }),
        },
      ],
    }).compile();

    service = module.get(EmissionsChecksService);
    monitorFormulaRepository = module.get(MonitorFormulaRepository);
  });

  describe('test runChecks()', () => {
    it('should successfully import', async () => {
      const emissionsPayload = genEmissionsImportDto(1, {
        include: ['dailyEmissionData'],
      });

      const result = service.runChecks(emissionsPayload[0]);
      await expect(result).resolves.toEqual([]);
    });

    it('should throw errors for emissions payload without children data', async () => {
      const emissionsPayload = genEmissionsImportDto();

      await expect(service.runChecks(emissionsPayload[0])).rejects.toThrow(
        EaseyException,
      );
    });

    it('should throw errors as array of strings', () => {
      try {
        service.throwIfErrors(['test']);
      } catch (error) {
        expect(error?.response?.message).toStrictEqual('test');
      }
    });
  });

  describe('invalidDatesCheck', () => {
    it('should return empty array for empty DTO', function() {
      const payload = new EmissionsImportDTO();

      const result = service.invalidDatesCheck(payload);
      expect(result).toEqual([]);
    });

    it('should return empty array for valid dates', function() {
      const payload = genEmissionsImportDto()[0];
      const weeklyTestSummaryData = [new WeeklyTestSummaryDTO()];

      const today = new Date();
      payload.year = today.getFullYear();
      payload.quarter = Math.floor(today.getMonth() / 3 + 1);
      payload.weeklyTestSummaryData = weeklyTestSummaryData;
      payload.weeklyTestSummaryData[0].date = new Date();

      expect(service.invalidDatesCheck(payload)).toEqual([]);
    });

    it('should return error for invalid dates', function() {
      const payload = genEmissionsImportDto(1, {
        include: [
          'dailyEmissionData',
          'dailyTestSummaryData',
          'hourlyOperatingData',
          'sorbentTrapData',
          'weeklyTestSummaryData',
        ],
      })[0];
      const weeklyTestSummaryData = [new WeeklyTestSummaryDTO()];

      // Payload date is greater than highest date in data
      const today = new Date();
      payload.year = today.getFullYear();
      payload.quarter = Math.floor(today.getMonth() / 3 + 1) + 1;
      payload.weeklyTestSummaryData = weeklyTestSummaryData;
      payload.dailyEmissionData[0].date = new Date();
      payload.dailyTestSummaryData[0].date = new Date();
      payload.hourlyOperatingData[0].date = new Date();
      payload.sorbentTrapData[0].beginDate = new Date();
      payload.sorbentTrapData[0].endDate = new Date();
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

  describe('invalidFormulasCheck', () => {
    let payload;

    beforeAll(() => {
      payload = genEmissionsImportDto(1, {
        include: ['hourlyOperatingData'],
        hourlyOperatingAmount: 3,
        hourlyOperatingImportConfig: {
          derivedHourlyValueAmount: 3,
          matsDerivedHourlyValueAmount: 3,
          hourlyFuelFlowAmount: 3,
          include: [
            'derivedHourlyValueData',
            'matsDerivedHourlyValueData',
            'hourlyFuelFlowData',
          ],
          hourlyFuelFlowConfig: {
            include: ['hourlyParameterFuelFlowData'],
            hourlyParamFuelFlowAmount: 3,
          },
        },
      })[0];
    });

    it('should return an empty array for empty request', async function() {
      const payload = new EmissionsImportDTO();
      const moniotorLocation = new MonitorLocation();
      moniotorLocation.unit = new Unit();
      moniotorLocation.stackPipe = new StackPipe();
      moniotorLocation.id = '2';

      await expect(
        service.invalidFormulasCheck(payload, [moniotorLocation]),
      ).resolves.toEqual(undefined);
    });
  });
});
