import { Test, TestingModule } from '@nestjs/testing';

import { EmissionsWorkspaceService } from './emissions.service';
import { DailyTestSummaryWorkspaceService } from '../daily-test-summary-workspace/daily-test-summary.service';
import { DailyCalibrationWorkspaceService } from '../daily-calibration-workspace/daily-calibration.service';
import { EmissionsMap } from '../maps/emissions.map';
import { DailyTestSummaryMap } from '../maps/daily-test-summary.map';
import { DailyCalibrationMap } from '../maps/daily-calibration.map';
import { EmissionsWorkspaceRepository } from './emissions.repository';
import { DailyCalibrationWorkspaceRepository } from '../daily-calibration-workspace/daily-calibration.repository';
import { DailyTestSummaryWorkspaceRepository } from '../daily-test-summary-workspace/daily-test-summary.repository';
import { PlantRepository } from '../plant/plant.repository';
import { HourlyOperatingWorkspaceService } from '../hourly-operating-workspace/hourly-operating.service';
import { MonitorHourlyValueWorkspaceService } from '../monitor-hourly-value-workspace/monitor-hourly-value.service';
import { HourlyOperatingWorkspaceRepository } from '../hourly-operating-workspace/hourly-operating.repository';
import { MonitorHourlyValueWorkspaceRepository } from '../monitor-hourly-value-workspace/monitor-hourly-value.repository';
import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import { MonitorHourlyValueMap } from '../maps/monitor-hourly-value.map';
import { MatsMonitorHourlyValueWorkspaceService } from '../mats-monitor-hourly-value-workspace/mats-monitor-hourly-value.service';
import { MatsMonitorHourlyValueMap } from '../maps/mats-monitor-hourly-value.map';
import { MatsMonitorHourlyValueWorkspaceRepository } from '../mats-monitor-hourly-value-workspace/mats-monitor-hourly-value.repository';
import { MatsDerivedHourlyValueMap } from '../maps/mats-derived-hourly-value.map';
import { MatsDerivedHourlyValueWorkspaceService } from '../mats-derived-hourly-value-workspace/mats-derived-hourly-value.service';
import { MatsDerivedHourlyValueWorkspaceRepository } from '../mats-derived-hourly-value-workspace/mats-derived-hourly-value.repository';
import { DerivedHourlyValueWorkspaceService } from '../derived-hourly-value-workspace/derived-hourly-value-workspace.service';
import { DerivedHourlyValueWorkspaceRepository } from '../derived-hourly-value-workspace/derived-hourly-value-workspace.repository';
import { DerivedHourlyValueMap } from '../maps/derived-hourly-value.map';
import { mockEmissionsWorkspaceRepository } from '../../test/mocks/emissions-workspace-repository';
import { genEmissionEvaluation } from '../../test/object-generators/emission-evaluation';
import {
  genEmissionsImportDto,
  genEmissionsRecordDto,
} from '../../test/object-generators/emissions-dto';
import { mockDailyTestSummaryWorkspaceRepository } from '../../test/mocks/mock-daily-test-summary-workspace-repository';
import { mockHourlyOperatingWorkspaceRepository } from '../../test/mocks/hourly-operating-workspace-repository';
import { mockPlantRepository } from '../../test/mocks/plant-repository';
import { genPlant } from '../../test/object-generators/plant';
import { EmissionEvaluation } from '../entities/workspace/emission-evaluation.entity';
import { Plant } from '../entities/plant.entity';
import { faker } from '@faker-js/faker';
import { EmissionsChecksService } from './emissions-checks.service';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { WeeklyTestSummaryCheckService } from '../weekly-test-summary-workspace/weekly-test-summary-check.service';
import { DailyTestSummaryCheckService } from '../daily-test-summary-workspace/daily-test-summary-check.service';
import { MonitorLocationChecksService } from '../monitor-location-workspace/monitor-location-checks.service';
import { MonitorFormulaRepository } from '../monitor-formula/monitor-formula.repository';
import { MonitorLocationWorkspaceRepository } from '../monitor-location-workspace/monitor-location.repository';
import { HourlyGasFlowMeterMap } from '../maps/hourly-gas-flow-meter.map';
import { mockHourlyGasFlowMeterWorkspaceRepository } from '../../test/mocks/mock-hourly-gas-flow-meter-workspace-repository';
import { HourlyGasFlowMeterWorkspaceService } from '../hourly-gas-flow-meter-workspace/hourly-gas-flow-meter.service';
import { HourlyGasFlowMeterWorkspaceRepository } from '../hourly-gas-flow-meter-workspace/hourly-gas-flow-meter.repository';
import { ComponentRepository } from '../component/component.repository';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { MonitorPlanChecksService } from '../monitor-plan-workspace/monitor-plan-checks.service';
import { MonitorPlanWorkspaceRepository } from '../monitor-plan-workspace/monitor-plan-repository';
import { HourlyFuelFlowWorkspaceService } from '../hourly-fuel-flow-workspace/hourly-fuel-flow-workspace.service';
import { HourlyFuelFlowWorkspaceRepository } from '../hourly-fuel-flow-workspace/hourly-fuel-flow-workspace.repository';
import { HourlyFuelFlowMap } from '../maps/hourly-fuel-flow-map';
import { HourlyParameterFuelFlowWorkspaceRepository } from '../hourly-parameter-fuel-flow-workspace/hourly-parameter-fuel-flow-workspace.repository';
import { HourlyParameterFuelFlowWorkspaceService } from '../hourly-parameter-fuel-flow-workspace/hourly-parameter-fuel-flow-workspace.service';
import { HourlyParameterFuelFlowMap } from '../maps/hourly-parameter-fuel-flow.map';
import { DailyEmissionWorkspaceService } from '../daily-emission-workspace/daily-emission-workspace.service';
import { DailyEmissionWorkspaceRepository } from '../daily-emission-workspace/daily-emission-workspace.repository';
import { DailyEmissionMap } from '../maps/daily-emission.map';
import { DailyFuelWorkspaceService } from '../daily-fuel-workspace/daily-fuel-workspace.service';
import { DailyFuelWorkspaceRepository } from '../daily-fuel-workspace/daily-fuel-workspace.repository';
import { DailyFuelMap } from '../maps/daily-fuel.map';
import { SorbentTrapWorkspaceService } from '../sorbent-trap-workspace/sorbent-trap-workspace.service';
import { SorbentTrapWorkspaceRepository } from '../sorbent-trap-workspace/sorbent-trap-workspace.repository';
import { SamplingTrainWorkspaceService } from '../sampling-train-workspace/sampling-train-workspace.service';
import { SamplingTrainWorkspaceRepository } from '../sampling-train-workspace/sampling-train-workspace.repository';
import { EmissionsDTO } from '../dto/emissions.dto';
import { WeeklyTestSummaryWorkspaceService } from '../weekly-test-summary-workspace/weekly-test-summary.service';
import { WeeklyTestSummaryWorkspaceRepository } from '../weekly-test-summary-workspace/weekly-test-summary.repository';
import { WeeklyTestSummaryMap } from '../maps/weekly-test-summary.map';
import { WeeklySystemIntegrityWorkspaceService } from '../weekly-system-integrity-workspace/weekly-system-integrity.service';
import { WeeklySystemIntegrityWorkspaceRepository } from '../weekly-system-integrity-workspace/weekly-system-integrity.repository';
import { WeeklySystemIntegrityMap } from '../maps/weekly-system-integrity.map';
import { Nsps4tCompliancePeriodWorkspaceRepository } from '../nsps4t-compliance-period-workspace/nsps4t-compliance-period-workspace.repository';
import { Nsps4tCompliancePeriodWorkspaceService } from '../nsps4t-compliance-period-workspace/nsps4t-compliance-period-workspace.service';
import { Nsps4tAnnualWorkspaceRepository } from '../nsps4t-annual-workspace/nsps4t-annual-workspace.repository';
import { Nsps4tAnnualWorkspaceService } from '../nsps4t-annual-workspace/nsps4t-annual-workspace.service';
import { SummaryValueWorkspaceService } from '../summary-value-workspace/summary-value.service';
import { SummaryValueMap } from '../maps/summary-value.map';
import { SummaryValueWorkspaceRepository } from '../summary-value-workspace/summary-value.repository';
import { Nsps4tSummaryWorkspaceRepository } from '../nsps4t-summary-workspace/nsps4t-summary-workspace.repository';
import { Nsps4tSummaryWorkspaceService } from '../nsps4t-summary-workspace/nsps4t-summary-workspace.service';
import { WeeklyTestSummaryRepository } from '../weekly-test-summary/weekly-test-summary.repository';
import { WeeklyTestSummaryService } from '../weekly-test-summary/weekly-test-summary.service';
import { WeeklySystemIntegrityRepository } from '../weekly-system-integrity/weekly-system-integrity.repository';
import { WeeklySystemIntegrityService } from '../weekly-system-integrity/weekly-system-integrity.service';
import { LongTermFuelFlowWorkspaceService } from '../long-term-fuel-flow-workspace/long-term-fuel-flow.service';
import { LongTermFuelFlowWorkspaceRepository } from '../long-term-fuel-flow-workspace/long-term-fuel-flow.repository';
import { mockLongTermFuelFlowWorkspaceRepository } from '../../test/mocks/mock-long-term-fuel-flow-workspace-repository';
import { LongTermFuelFlowMap } from '../maps/long-term-fuel-flow.map';
import { LongTermFuelFlowService } from '../long-term-fuel-flow/long-term-fuel-flow.service';
import * as typeorm_functions from 'typeorm/globals';
import { EntityManager } from 'typeorm';
import { ReportingPeriod } from '../entities/workspace/reporting-period.entity';
import { BulkLoadModule } from '@us-epa-camd/easey-common/bulk-load';
import { MonitorLocation } from '../entities/monitor-location.entity';
import { ConfigService } from '@nestjs/config';
import { DailyBackstopWorkspaceModule } from '../daily-backstop-workspace/daily-backstop.module';
import {DailyBackstopWorkspaceRepository} from "../daily-backstop-workspace/daily-backstop.repository";
import {DailyBackstopMap} from "../maps/daily-backstop.map";
import {DailyBackstopWorkspaceService} from "../daily-backstop-workspace/daily-backstop.service";
import { CodeChecksService } from '../code-checks/code-checks.service';

describe('Emissions Workspace Service', () => {
  let dailyTestsummaryService: DailyTestSummaryWorkspaceService;
  let longTermFuelFlowService: LongTermFuelFlowWorkspaceService;
  let dailyBackstopService: DailyBackstopWorkspaceService;
  let emissionsRepository: EmissionsWorkspaceRepository;
  let emissionsService: EmissionsWorkspaceService;
  let emissionsMap: EmissionsMap;
  let plantRepository: PlantRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BulkLoadModule,],
      providers: [
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
      ],
    }).compile();

    longTermFuelFlowService = module.get(LongTermFuelFlowWorkspaceService);
    dailyTestsummaryService = module.get(DailyTestSummaryWorkspaceService);
    dailyBackstopService = module.get(DailyBackstopWorkspaceService);
    emissionsRepository = module.get(EmissionsWorkspaceRepository);
    emissionsService = module.get(EmissionsWorkspaceService);
    emissionsMap = module.get(EmissionsMap);
    plantRepository = module.get(PlantRepository);
  });

  it('should have a emissions service', function() {
    expect(emissionsService).toBeDefined();
  });

  it('should delete a record', async function() {
    await expect(
      emissionsService.delete({ monitorPlanId: '123', reportingPeriodId: 2 }),
    ).resolves.toEqual(undefined);
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
    jest.spyOn(typeorm_functions, 'getManager').mockReturnValue(({
      findOne: jest.fn().mockResolvedValue(new ReportingPeriod()),
      query: jest.fn(),
    } as unknown) as EntityManager);

    const emissionsDtoMock = genEmissionsImportDto(1, {
      include: ['longTermFuelFlowData'],
    });
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

    await expect(emissionsService.import(emissionsDtoMock[0])).resolves.toEqual(
      {
        message: `Successfully Imported Emissions Data for Facility Id/Oris Code [${emissionsDtoMock[0].orisCode}]`,
      },
    );
  });

  it('should import daily test summaries', async function() {
    const emissionsDtoMock = genEmissionsImportDto();
    const dtoMockWithDailyTest = genEmissionsImportDto(1, {
      include: ['dailyTestSummaryData'],
      dailyTestSummaryAmount: 3,
    });

    jest.spyOn(dailyTestsummaryService, 'import').mockReturnValue(undefined);

    const monitoringLocation = new MonitorLocation();
    await expect(
      emissionsService.importDailyTestSummaries(
        emissionsDtoMock[0],
        [monitoringLocation],
        faker.datatype.number(),
        { monitoringSystems: {}, components: {}, monitorFormulas: {} },
        new Date().toISOString(),
      ),
    ).resolves.toBeUndefined();

    await expect(
      emissionsService.importDailyTestSummaries(
        dtoMockWithDailyTest[0],
        [monitoringLocation],
        faker.datatype.number(),
        { monitoringSystems: {}, components: {}, monitorFormulas: {} },
        new Date().toISOString(),
      ),
    ).resolves;
  });
});
