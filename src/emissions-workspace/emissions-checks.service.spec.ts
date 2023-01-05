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
import { genMonitorFormula } from '../../test/object-generators/monitor-formula';
import { MonitorFormula } from '../entities/workspace/monitor-formula.entity';
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

describe('Emissions Checks Service Tests', () => {
  let service: EmissionsChecksService;
  let monitorFormulaRepository: MonitorFormulaRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, CheckCatalogService],
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
    it('should run successfully', async () => {
      const emissionsPayload = genEmissionsImportDto();
      const result = service.runChecks(emissionsPayload[0]);

      await expect(result).resolves.toEqual([]);
    });

    it('should throw errors as array of strings', ()=>{
      try{
        service.throwIfErrors(['test']);
      }catch(error){
        expect(error?.response?.message).toStrictEqual(['test'])
      };

    })
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

      await expect(service.invalidFormulasCheck(payload, '2')).resolves.toEqual(
        undefined,
      );
    });

    it('should return an empty array given data with valid formulaIdentifiers', async function() {
      jest
        .spyOn(monitorFormulaRepository, 'getOneFormulaIdsMonLocId')
        .mockResolvedValue(genMonitorFormula<MonitorFormula>()[0]);

      await expect(service.invalidFormulasCheck(payload, '1')).resolves.toEqual(
        undefined,
      );
    });

    it('should return an array with the Import-28 message given data without valid formulaIdentifiers', async function() {
      const errorMessage =
        'The Client Tool database does not contain [FormulaID]. This file was not imported.';
      jest
        .spyOn(monitorFormulaRepository, 'getOneFormulaIdsMonLocId')
        .mockResolvedValue(undefined);
      CheckCatalogService.formatResultMessage = () => {
        return errorMessage;
      };

      await expect(service.invalidFormulasCheck(payload, '2')).rejects.toThrow(
        errorMessage,
      );
    });
  });
});
