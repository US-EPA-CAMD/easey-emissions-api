import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { ConfigService } from '@nestjs/config';
import { BulkLoadModule, BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { EntityManager } from 'typeorm';

import { mockEmissionsWorkspaceRepository } from '../../test/mocks/emissions-workspace-repository';
import { mockHourlyOperatingWorkspaceRepository } from '../../test/mocks/hourly-operating-workspace-repository';
import { mockDailyTestSummaryWorkspaceRepository } from '../../test/mocks/mock-daily-test-summary-workspace-repository';
import { mockHourlyGasFlowMeterWorkspaceRepository } from '../../test/mocks/mock-hourly-gas-flow-meter-workspace-repository';
import { mockLongTermFuelFlowWorkspaceRepository } from '../../test/mocks/mock-long-term-fuel-flow-workspace-repository';
import { mockPlantRepository } from '../../test/mocks/plant-repository';
import { genEmissionEvaluation } from '../../test/object-generators/emission-evaluation';
import {
  genEmissionsImportDto,
  genEmissionsRecordDto,
} from '../../test/object-generators/emissions-dto';
import { genPlant } from '../../test/object-generators/plant';
import { CodeChecksService } from '../code-checks/code-checks.service';
import { ComponentRepository } from '../component/component.repository';
import { DailyBackstopWorkspaceRepository } from '../daily-backstop-workspace/daily-backstop.repository';
import { DailyBackstopWorkspaceService } from '../daily-backstop-workspace/daily-backstop.service';
import { DailyCalibrationWorkspaceRepository } from '../daily-calibration-workspace/daily-calibration.repository';
import { DailyCalibrationWorkspaceService } from '../daily-calibration-workspace/daily-calibration.service';
import { DailyEmissionWorkspaceRepository } from '../daily-emission-workspace/daily-emission-workspace.repository';
import { DailyEmissionWorkspaceService } from '../daily-emission-workspace/daily-emission-workspace.service';
import { DailyFuelWorkspaceRepository } from '../daily-fuel-workspace/daily-fuel-workspace.repository';
import { DailyFuelWorkspaceService } from '../daily-fuel-workspace/daily-fuel-workspace.service';
import { DailyTestSummaryCheckService } from '../daily-test-summary-workspace/daily-test-summary-check.service';
import { DailyTestSummaryWorkspaceRepository } from '../daily-test-summary-workspace/daily-test-summary.repository';
import { DailyTestSummaryWorkspaceService } from '../daily-test-summary-workspace/daily-test-summary.service';
import { DerivedHourlyValueWorkspaceRepository } from '../derived-hourly-value-workspace/derived-hourly-value-workspace.repository';
import { DerivedHourlyValueWorkspaceService } from '../derived-hourly-value-workspace/derived-hourly-value-workspace.service';
import { EmissionsDTO, EmissionsImportDTO } from '../dto/emissions.dto';
import { MonitorLocation } from '../entities/monitor-location.entity';
import { Plant } from '../entities/plant.entity';
import { EmissionEvaluation } from '../entities/workspace/emission-evaluation.entity';
import { ReportingPeriod } from '../entities/workspace/reporting-period.entity';
import { HourlyFuelFlowWorkspaceRepository } from '../hourly-fuel-flow-workspace/hourly-fuel-flow-workspace.repository';
import { HourlyFuelFlowWorkspaceService } from '../hourly-fuel-flow-workspace/hourly-fuel-flow-workspace.service';
import { HourlyGasFlowMeterWorkspaceRepository } from '../hourly-gas-flow-meter-workspace/hourly-gas-flow-meter.repository';
import { HourlyGasFlowMeterWorkspaceService } from '../hourly-gas-flow-meter-workspace/hourly-gas-flow-meter.service';
import { HourlyOperatingWorkspaceRepository } from '../hourly-operating-workspace/hourly-operating.repository';
import { HourlyOperatingWorkspaceService } from '../hourly-operating-workspace/hourly-operating.service';
import { HourlyParameterFuelFlowWorkspaceRepository } from '../hourly-parameter-fuel-flow-workspace/hourly-parameter-fuel-flow-workspace.repository';
import { HourlyParameterFuelFlowWorkspaceService } from '../hourly-parameter-fuel-flow-workspace/hourly-parameter-fuel-flow-workspace.service';
import { LongTermFuelFlowWorkspaceRepository } from '../long-term-fuel-flow-workspace/long-term-fuel-flow.repository';
import { LongTermFuelFlowWorkspaceService } from '../long-term-fuel-flow-workspace/long-term-fuel-flow.service';
import { DailyBackstopMap } from '../maps/daily-backstop.map';
import { DailyCalibrationMap } from '../maps/daily-calibration.map';
import { DailyEmissionMap } from '../maps/daily-emission.map';
import { DailyFuelMap } from '../maps/daily-fuel.map';
import { DailyTestSummaryMap } from '../maps/daily-test-summary.map';
import { DerivedHourlyValueMap } from '../maps/derived-hourly-value.map';
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
import { MatsDerivedHourlyValueWorkspaceRepository } from '../mats-derived-hourly-value-workspace/mats-derived-hourly-value.repository';
import { MatsDerivedHourlyValueWorkspaceService } from '../mats-derived-hourly-value-workspace/mats-derived-hourly-value.service';
import { MatsMonitorHourlyValueWorkspaceRepository } from '../mats-monitor-hourly-value-workspace/mats-monitor-hourly-value.repository';
import { MatsMonitorHourlyValueWorkspaceService } from '../mats-monitor-hourly-value-workspace/mats-monitor-hourly-value.service';
import { MonitorFormulaRepository } from '../monitor-formula/monitor-formula.repository';
import { MonitorHourlyValueWorkspaceRepository } from '../monitor-hourly-value-workspace/monitor-hourly-value.repository';
import { MonitorHourlyValueWorkspaceService } from '../monitor-hourly-value-workspace/monitor-hourly-value.service';
import { MonitorLocationChecksService } from '../monitor-location-workspace/monitor-location-checks.service';
import { MonitorLocationWorkspaceRepository } from '../monitor-location-workspace/monitor-location.repository';
import { MonitorPlanChecksService } from '../monitor-plan-workspace/monitor-plan-checks.service';
import { MonitorPlanWorkspaceRepository } from '../monitor-plan-workspace/monitor-plan.repository';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { Nsps4tAnnualWorkspaceRepository } from '../nsps4t-annual-workspace/nsps4t-annual-workspace.repository';
import { Nsps4tAnnualWorkspaceService } from '../nsps4t-annual-workspace/nsps4t-annual-workspace.service';
import { Nsps4tCompliancePeriodWorkspaceRepository } from '../nsps4t-compliance-period-workspace/nsps4t-compliance-period-workspace.repository';
import { Nsps4tCompliancePeriodWorkspaceService } from '../nsps4t-compliance-period-workspace/nsps4t-compliance-period-workspace.service';
import { Nsps4tSummaryWorkspaceRepository } from '../nsps4t-summary-workspace/nsps4t-summary-workspace.repository';
import { Nsps4tSummaryWorkspaceService } from '../nsps4t-summary-workspace/nsps4t-summary-workspace.service';
import { PlantRepository } from '../plant/plant.repository';
import { SamplingTrainWorkspaceRepository } from '../sampling-train-workspace/sampling-train-workspace.repository';
import { SamplingTrainWorkspaceService } from '../sampling-train-workspace/sampling-train-workspace.service';
import { SorbentTrapWorkspaceRepository } from '../sorbent-trap-workspace/sorbent-trap-workspace.repository';
import { SorbentTrapWorkspaceService } from '../sorbent-trap-workspace/sorbent-trap-workspace.service';
import { SummaryValueWorkspaceRepository } from '../summary-value-workspace/summary-value.repository';
import { SummaryValueWorkspaceService } from '../summary-value-workspace/summary-value.service';
import { WeeklySystemIntegrityWorkspaceRepository } from '../weekly-system-integrity-workspace/weekly-system-integrity.repository';
import { WeeklySystemIntegrityWorkspaceService } from '../weekly-system-integrity-workspace/weekly-system-integrity.service';
import { WeeklySystemIntegrityRepository } from '../weekly-system-integrity/weekly-system-integrity.repository';
import { WeeklySystemIntegrityService } from '../weekly-system-integrity/weekly-system-integrity.service';
import { WeeklyTestSummaryCheckService } from '../weekly-test-summary-workspace/weekly-test-summary-check.service';
import { WeeklyTestSummaryWorkspaceRepository } from '../weekly-test-summary-workspace/weekly-test-summary.repository';
import { WeeklyTestSummaryWorkspaceService } from '../weekly-test-summary-workspace/weekly-test-summary.service';
import { WeeklyTestSummaryRepository } from '../weekly-test-summary/weekly-test-summary.repository';
import { WeeklyTestSummaryService } from '../weekly-test-summary/weekly-test-summary.service';
import { EmissionsChecksService } from './emissions-checks.service';
import { EmissionsWorkspaceRepository } from './emissions.repository';
import { EmissionsWorkspaceService } from './emissions.service';
import { EaseyContentService } from '../emissions-easey-content/easey-content.service';
import { SummaryValueDataCheckService } from '../summary-value-workspace/summary-value-data-check.service';
import { EmissionsService } from '../emissions/emissions.service';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { CurrentUser }      from '@us-epa-camd/easey-common/interfaces';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('Emissions Workspace Service', () => {
  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      save: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      findOne: jest.fn(),
      query: jest.fn(),
    },
  };

  const mockEntityManager = {
    connection: {
      createQueryRunner: jest.fn(() => mockQueryRunner),
      },
    createQueryRunner: jest.fn(() => mockQueryRunner),
    findOne: jest.fn(),
  } as unknown as EntityManager;

  let dailyTestsummaryService: DailyTestSummaryWorkspaceService;
  let longTermFuelFlowService: LongTermFuelFlowWorkspaceService;
  let dailyBackstopService: DailyBackstopWorkspaceService;
  let emissionsRepository: EmissionsWorkspaceRepository;
  let emissionsService: EmissionsWorkspaceService;
  let emissionsMap: EmissionsMap;
  let plantRepository: PlantRepository;
  let manager: EntityManager;
  let bulkLoadService: BulkLoadService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BulkLoadModule],
      providers: [
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
        {
          provide: BulkLoadService,
          useValue: {
            startBulkLoader: jest.fn().mockResolvedValue({
              writeObject: jest.fn(),
              complete: jest.fn(),
              finished: Promise.resolve(true),
              status: 'Complete',
            }),
            completeBulkLoad: jest.fn(),
            abortBulkLoad: jest.fn(),
          },
        },
        ConfigService,
        DerivedHourlyValueMap,
        DerivedHourlyValueWorkspaceService,
        EmissionsWorkspaceService,
        DailyEmissionWorkspaceService,
        DailyEmissionWorkspaceRepository,
        DailyEmissionMap,
        DailyFuelWorkspaceService,
        DailyFuelWorkspaceRepository,
        DailyFuelMap,
        DailyTestSummaryCheckService,
        DailyTestSummaryWorkspaceService,
        DailyCalibrationWorkspaceService,
        EmissionsMap,
        EmissionsChecksService,
        CodeChecksService,
        Logger,
        DailyTestSummaryMap,
        DailyCalibrationMap,
        HourlyOperatingMap,
        MonitorHourlyValueMap,
        MonitorLocationChecksService,
        MonitorPlanChecksService,
        HourlyOperatingWorkspaceService,
        MonitorFormulaRepository,
        MonitorLocationWorkspaceRepository,
        MonitorPlanWorkspaceRepository,
        MonitorHourlyValueWorkspaceService,
        MatsMonitorHourlyValueWorkspaceService,
        MatsMonitorHourlyValueMap,
        MatsDerivedHourlyValueMap,
        MatsDerivedHourlyValueWorkspaceService,
        WeeklyTestSummaryCheckService,
        HourlyFuelFlowWorkspaceService,
        HourlyFuelFlowWorkspaceRepository,
        HourlyFuelFlowMap,
        HourlyParameterFuelFlowWorkspaceRepository,
        HourlyParameterFuelFlowWorkspaceService,
        HourlyParameterFuelFlowMap,
        HourlyGasFlowMeterMap,
        HourlyGasFlowMeterWorkspaceService,
        ComponentRepository,
        MonitorSystemRepository,
        SorbentTrapWorkspaceService,
        SorbentTrapWorkspaceRepository,
        SamplingTrainWorkspaceService,
        SamplingTrainWorkspaceRepository,
        WeeklyTestSummaryWorkspaceService,
        WeeklyTestSummaryWorkspaceRepository,
        WeeklyTestSummaryMap,
        WeeklySystemIntegrityWorkspaceService,
        WeeklySystemIntegrityWorkspaceRepository,
        WeeklySystemIntegrityMap,
        Nsps4tCompliancePeriodWorkspaceRepository,
        Nsps4tCompliancePeriodWorkspaceService,
        Nsps4tAnnualWorkspaceRepository,
        Nsps4tAnnualWorkspaceService,
        Nsps4tSummaryWorkspaceRepository,
        Nsps4tSummaryWorkspaceService,
        SummaryValueWorkspaceService,
        SummaryValueMap,
        SummaryValueWorkspaceRepository,
        WeeklyTestSummaryRepository,
        WeeklyTestSummaryService,
        WeeklyTestSummaryMap,
        WeeklySystemIntegrityRepository,
        WeeklySystemIntegrityService,
        WeeklySystemIntegrityMap,
        LongTermFuelFlowMap,
        LongTermFuelFlowWorkspaceService,
        DailyBackstopWorkspaceService,
        DailyBackstopMap,
        SummaryValueDataCheckService,
        {
          provide: LongTermFuelFlowWorkspaceRepository,
          useValue: mockLongTermFuelFlowWorkspaceRepository,
        },
        {
          provide: DerivedHourlyValueWorkspaceRepository,
          useValue: jest,
        },
        {
          provide: PlantRepository,
          useValue: mockPlantRepository,
        },
        {
          provide: EmissionsWorkspaceRepository,
          useValue: mockEmissionsWorkspaceRepository,
        },
        {
          provide: DailyTestSummaryWorkspaceRepository,
          useValue: mockDailyTestSummaryWorkspaceRepository,
        },
        {
          provide: DailyCalibrationWorkspaceRepository,
          useValue: jest.mock(
            '../daily-calibration-workspace/daily-calibration.repository',
          ),
        },
        {
          provide: HourlyOperatingWorkspaceRepository,
          useValue: mockHourlyOperatingWorkspaceRepository,
        },
        {
          provide: MonitorHourlyValueWorkspaceRepository,
          useValue: jest.mock(
            '../monitor-hourly-value-workspace/monitor-hourly-value.repository',
          ),
        },
        {
          provide: MatsMonitorHourlyValueWorkspaceRepository,
          useValue: jest.mock(
            '../mats-monitor-hourly-value-workspace/mats-monitor-hourly-value.repository',
          ),
        },
        {
          provide: MatsDerivedHourlyValueWorkspaceRepository,
          useValue: jest.mock(
            '../mats-derived-hourly-value-workspace/mats-derived-hourly-value.repository',
          ),
        },
        {
          provide: HourlyGasFlowMeterWorkspaceRepository,
          useValue: mockHourlyGasFlowMeterWorkspaceRepository,
        },
        {
          provide: DailyBackstopWorkspaceRepository,
          useValue: jest.mock(
            '../daily-backstop-workspace/daily-backstop.repository',
          ),
        },
        {
          provide: EaseyContentService,
          useFactory:  () => ({
            emissionsSchema: jest.fn().mockResolvedValue({
              version : '1.0.0'
            }),
          })
        },
        {
          provide: EmissionsService,
          useValue: {
            export: jest.fn(),
          },
        },
        {
          provide: EmissionsChecksService,
          useValue: { 
            runChecks: jest.fn(), 
            invalidFormulasCheck: jest.fn(),
          },
        },
      ],
    }).compile();

    longTermFuelFlowService = module.get(LongTermFuelFlowWorkspaceService);
    dailyTestsummaryService = module.get(DailyTestSummaryWorkspaceService);
    dailyBackstopService = module.get(DailyBackstopWorkspaceService);
    emissionsRepository = module.get(EmissionsWorkspaceRepository);
    emissionsService = module.get(EmissionsWorkspaceService);
    emissionsMap = module.get(EmissionsMap);
    plantRepository = module.get(PlantRepository);
    manager = module.get(EntityManager);
     bulkLoadService = module.get(BulkLoadService);
  });

  it('should have a emissions service', function() {
    expect(emissionsService).toBeDefined();
  });

  it('should delete a record', async function() {
    await expect(
      emissionsService.delete({ monitorPlanId: '123', reportingPeriodId: 2 }),
    ).resolves.toEqual(undefined);
  });

  it('should successfully import from historical', async () => {
    const workspace = emissionsService as any;
    const params = {
      monitorPlanId: 'MP1',
      year: 2020,
      quarter: 2,
      reportedValuesOnly: false,
    } as EmissionsParamsDTO;
    const user: CurrentUser = { userId: 'user1' } as any;
    const stubbedData = genEmissionsImportDto(1, {
      include: ['longTermFuelFlowData'],
    });

    workspace.emissionsService.export.mockResolvedValueOnce(stubbedData);
    workspace.checksService.runChecks.mockResolvedValueOnce([]);
    const importSpy = jest.spyOn(workspace, 'import').mockResolvedValueOnce({ message: 'Imported Historical' });

    const result = await emissionsService.importFromHistoricalData(params, user);

    expect(workspace.emissionsService.export).toHaveBeenCalledWith(
      params,
      params.reportedValuesOnly,
    );
    expect(workspace.checksService.runChecks).toHaveBeenCalledWith(stubbedData);
    expect(importSpy).toHaveBeenCalledWith(stubbedData, user.userId);
    expect(result).toEqual({ message: 'Imported Historical' });
  });

  it('should propagate export errors', async () => {
    const workspace = emissionsService as any;
    const params = {
      monitorPlanId: 'MP1',
      year: 2020,
      quarter: 2,
      reportedValuesOnly: true,
    } as EmissionsParamsDTO;
    const user: CurrentUser = { userId: 'user1' } as any;

    workspace.emissionsService.export.mockRejectedValue(
      new Error('export failed'),
    );

    await expect(
      emissionsService.importFromHistoricalData(params, user),
    ).rejects.toThrow('export failed');
  });

  it('should propagate runChecks errors', async () => {
    const workspace = emissionsService as any;
    const params = {
      monitorPlanId: 'MP1',
      year: 2020,
      quarter: 2,
      reportedValuesOnly: false,
    } as EmissionsParamsDTO;
    const user: CurrentUser = { userId: 'user1' } as any;
    const stubbedData = genEmissionsImportDto(1, {
      include: ['longTermFuelFlowData'],
    });

    workspace.emissionsService.export.mockResolvedValue(stubbedData);
    workspace.checksService.runChecks.mockRejectedValue(
      new NotFoundException('no data'),
    );

    await expect(
      emissionsService.importFromHistoricalData(params, user),
    ).rejects.toThrow(NotFoundException);
  });

  it('should successfully export emissions data', async function() {
    const emissionsMocks = genEmissionEvaluation<EmissionEvaluation>();
    const dtoMocks = genEmissionsRecordDto();

    jest
      .spyOn(emissionsRepository, 'export')
      .mockResolvedValue(emissionsMocks[0]);

    await expect(emissionsService.export(dtoMocks[0])).resolves.toEqual(
      new EmissionsDTO(),
    );
  });

  it('should successfully import', async function() {
    jest.spyOn(longTermFuelFlowService, 'import').mockResolvedValue(undefined);

    const emissionsDtoMock = genEmissionsImportDto(1, {
      include: ['longTermFuelFlowData'],
    });

    const mockReportingPeriod = new ReportingPeriod();
    mockReportingPeriod.id = 1;
    mockReportingPeriod.year = emissionsDtoMock[0].year;
    mockReportingPeriod.quarter = emissionsDtoMock[0].quarter;

    // Mock the pre-transaction EntityManager.findOne call for the ReportingPeriod
    (mockEntityManager.findOne as jest.Mock).mockResolvedValue(mockReportingPeriod);

    // Mock the transaction manager calls
    mockQueryRunner.manager.query.mockResolvedValue([]);

    const plantMock = genPlant<Plant>(1, {
      include: ['monitorPlans'],
      monitorPlanAmount: 1,
      monitorPlanConfig: {
        include: ['beginRptPeriod', 'endRptPeriod'],
      },
    });

    plantMock[0].monitorPlans[0].beginRptPeriod.year = emissionsDtoMock[0].year;
    plantMock[0].monitorPlans[0].beginRptPeriod.quarter =
      emissionsDtoMock[0].quarter;
    plantMock[0].monitorPlans[0].endRptPeriod = null;
    plantMock[0].monitorPlans[0].locations = [new MonitorLocation()];

    jest
      .spyOn(plantRepository, 'getImportPlant')
      .mockResolvedValue(plantMock[0]);

    await expect(emissionsService.import(emissionsDtoMock[0], 'test-user-id')).resolves.toEqual(
      {
        message: `Successfully Imported Emissions Data for Facility Id/Oris Code [${emissionsDtoMock[0].orisCode}]`,
      },
    );

    // Verify that the pre-transaction EntityManager.findOne was called for ReportingPeriod
    expect(mockEntityManager.findOne).toHaveBeenCalledWith(ReportingPeriod, {
      where: {
        year: emissionsDtoMock[0].year,
        quarter: emissionsDtoMock[0].quarter,
      },
    });

    // Verify transaction was started after validation
    expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
    expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
  });

  it('should handle transaction rollback on error', async function() {
    const emissionsDtoMock = genEmissionsImportDto(1, {
      include: ['longTermFuelFlowData'],
    });

    const mockReportingPeriod = new ReportingPeriod();
    mockReportingPeriod.id = 1;
    mockReportingPeriod.year = emissionsDtoMock[0].year;
    mockReportingPeriod.quarter = emissionsDtoMock[0].quarter;

    // Mock successful pre-transaction setup
    (mockEntityManager.findOne as jest.Mock).mockResolvedValue(mockReportingPeriod);

    const plantMock = genPlant<Plant>(1, {
      include: ['monitorPlans'],
      monitorPlanAmount: 1,
      monitorPlanConfig: {
        include: ['beginRptPeriod', 'endRptPeriod'],
      },
    });

    plantMock[0].monitorPlans[0].beginRptPeriod.year = emissionsDtoMock[0].year;
    plantMock[0].monitorPlans[0].beginRptPeriod.quarter =
      emissionsDtoMock[0].quarter;
    plantMock[0].monitorPlans[0].endRptPeriod = null;
    plantMock[0].monitorPlans[0].locations = [new MonitorLocation()];

    jest
      .spyOn(plantRepository, 'getImportPlant')
      .mockResolvedValue(plantMock[0]);

    // Mock transaction failure
    mockQueryRunner.manager.query.mockRejectedValue(new Error('Database error'));

    await expect(emissionsService.import(emissionsDtoMock[0], 'test-user-id')).rejects.toThrow('Database error');

    // Verify transaction was started and rolled back
    expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
    expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    expect(mockQueryRunner.release).toHaveBeenCalled();
  });

  it('should import daily test summaries', async function() {
    const emissionsDtoMock = genEmissionsImportDto();
    const dtoMockWithDailyTest = genEmissionsImportDto(1, {
      include: ['dailyTestSummaryData'],
      dailyTestSummaryAmount: 3,
    });

    jest.spyOn(dailyTestsummaryService, 'import').mockReturnValue(undefined);

    const monitoringLocation = new MonitorLocation();
    const identifiers = { locations: {}, userId: '' };
    const monitoringLocationId = faker.datatype.string();
    identifiers.locations[monitoringLocationId] = {
      components: {},
      monitorFormulas: {},
      monitoringSystems: {},
    };
    await expect(
      emissionsService.importDailyTestSummaries(
        emissionsDtoMock[0],
        [monitoringLocation],
        faker.datatype.number(),
        identifiers,
        new Date().toISOString(),
      ),
    ).resolves.toBeUndefined();

    await expect(
      emissionsService.importDailyTestSummaries(
        dtoMockWithDailyTest[0],
        [monitoringLocation],
        faker.datatype.number(),
        identifiers,
        new Date().toISOString(),
      ),
    ).resolves;
    });

  // Tests location lookup with anyOf schema compliance
  describe('Location Lookup - anyOf Schema Compliance', () => {
    beforeEach(() => {
      // Mock bulkLoadService to prevent database connections
      jest.spyOn(bulkLoadService, 'startBulkLoader').mockResolvedValue({
        writeObject: jest.fn(),
        complete: jest.fn().mockResolvedValue(undefined),
      } as any);

      // Reset database mocks for successful operations (override previous test failures)
      mockQueryRunner.manager.query.mockResolvedValue([
        { result: 'S', error_msg: null }
      ]);
      mockQueryRunner.manager.save.mockResolvedValue({});
      mockQueryRunner.manager.insert.mockResolvedValue({});
      mockQueryRunner.manager.update.mockResolvedValue({});

      // Mock successful ReportingPeriod lookup
      (mockEntityManager.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        year: 2023,
        quarter: 1,
      });

      // Mock successful plant lookup with all test locations
      jest.spyOn(plantRepository, 'getImportPlant').mockResolvedValue({
        monitorPlans: [{
          beginRptPeriod: { year: 2023, quarter: 1 },
          endRptPeriod: null,
          locations: [
            { id: 'LOC1', unit: { name: '3' }, stackPipe: null },
            { id: 'LOC2', unit: null, stackPipe: { name: 'CS1' } },
            { id: 'LOC3', unit: { name: '4' }, stackPipe: { name: 'CS2' } },
          ],
        }]
      } as any);
    });

    const mockLocations = [
      {
        id: 'LOC1',
        unit: { name: '3' },
        stackPipe: null
      },
      {
        id: 'LOC2',
        unit: null,
        stackPipe: { name: 'CS1' }
      },
      {
        id: 'LOC3',
        unit: { name: '4' },
        stackPipe: { name: 'CS2' }
      },
    ];

    it('should find location with unitId only', async () => {
      const mockEmissionsImportDTO = new EmissionsImportDTO({
        orisCode: 12345,
        year: 2023,
        quarter: 1,
        dailyEmissionData: [
        { unitId: '3', stackPipeId: null, parameterCode: 'CO2', dailyFuelData: []  }
      ],
        dailyTestSummaryData: [],
        hourlyOperatingData: [],
        weeklyTestSummaryData: [],
        summaryValueData: [],
        longTermFuelFlowData: [],
        sorbentTrapData: [],
        nsps4tSummaryData: [],
        dailyBackstopData: [],
      });

      // Should not throw error for valid unitId-only location
      await expect(emissionsService.import(
        mockEmissionsImportDTO,
        'test-user-id'
      )).resolves.not.toThrow();
    });

    it('should find location with stackPipeId only', async () => {
      const mockEmissionsImportDTO = new EmissionsImportDTO( {
        orisCode: 12345,
        year: 2023,
        quarter: 1,
        dailyEmissionData: [
          { unitId: null, stackPipeId: 'CS1', parameterCode: 'CO2', dailyFuelData: []  }
        ],
        dailyTestSummaryData: [],
        hourlyOperatingData: [],
        weeklyTestSummaryData: [],
        summaryValueData: [],
        longTermFuelFlowData: [],
        sorbentTrapData: [],
        nsps4tSummaryData: [],
        dailyBackstopData: [],
      });

      // Should not throw error for valid stackPipeId-only location
      await expect(emissionsService.import(
        mockEmissionsImportDTO,
        'test-user-id'
      )).resolves.not.toThrow();
    });

    it('should find location with both identifiers', async () => {
      const mockEmissionsImportDTO = new EmissionsImportDTO( {
        orisCode: 12345,
        year: 2023,
        quarter: 1,
        dailyEmissionData: [
          { unitId: '4', stackPipeId: 'CS2', parameterCode: 'CO2', dailyFuelData: []  }
      ],
        dailyTestSummaryData: [],
        hourlyOperatingData: [],
        weeklyTestSummaryData: [],
        summaryValueData: [],
        longTermFuelFlowData: [],
        sorbentTrapData: [],
        nsps4tSummaryData: [],
        dailyBackstopData: [],
      });

      // Should not throw error for valid both identifiers location
      await expect(emissionsService.import(
        mockEmissionsImportDTO,
       'test-user-id'
      )).resolves.not.toThrow();
    });

    it('should throw error when no location found', async () => {
      const mockEmissionsImportDTO = new EmissionsImportDTO( {
        orisCode: 12345,
        year: 2023,
        quarter: 1,
        dailyEmissionData: [
          { unitId: 'NOMATCH', stackPipeId: null, parameterCode: 'CO2', dailyFuelData: []  }
      ],
        dailyTestSummaryData: [],
        hourlyOperatingData: [],
        weeklyTestSummaryData: [],
        summaryValueData: [],
        longTermFuelFlowData: [],
        sorbentTrapData: [],
        nsps4tSummaryData: [],
        dailyBackstopData: [],
      });

      await expect(
        emissionsService.import(
          mockEmissionsImportDTO,
          'test-user-id'
        )
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw error when multiple locations found', async () => {
      // Override plant mock to return ambiguous locations
      jest.spyOn(plantRepository, 'getImportPlant').mockResolvedValue({
        monitorPlans: [{
          beginRptPeriod: { year: 2023, quarter: 1 },
          endRptPeriod: null,
          locations: [
            { id: 'LOC1', unit: { name: '3' }, stackPipe: null },
            { id: 'LOC2', unit: { name: '3' }, stackPipe: null },
          ],
        }]
      } as any);

       const mockEmissionsImportDTO = new EmissionsImportDTO( {
        orisCode: 12345,
        year: 2023,
        quarter: 1,
        dailyEmissionData: [
        { unitId: '3', stackPipeId: null, parameterCode: 'CO2', dailyFuelData: []  }
        ],
        dailyTestSummaryData: [],
        hourlyOperatingData: [],
        weeklyTestSummaryData: [],
        summaryValueData: [],
        longTermFuelFlowData: [],
        sorbentTrapData: [],
        nsps4tSummaryData: [],
        dailyBackstopData: [],
      });

      await expect(
        emissionsService.import(
          mockEmissionsImportDTO,
          'test-user-id'
        )
      ).rejects.toThrow(BadRequestException);
    });
  });
});