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

describe('Emissions Workspace Service', () => {
  let dailyTestsummaryService: DailyTestSummaryWorkspaceService;
  let emissionsRepository: EmissionsWorkspaceRepository;
  let emissionsService: EmissionsWorkspaceService;
  let emissionsMap: EmissionsMap;
  let plantRepository: PlantRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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
      ],
    }).compile();

    dailyTestsummaryService = module.get(DailyTestSummaryWorkspaceService);
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

  it('should find one record from the repository', async function() {
    await expect(emissionsService.findOne()).resolves.toEqual(undefined);
  });

  it('should successfully import', async function() {
    const emissionsDtoMock = genEmissionsImportDto();
    const plantMock = genPlant<Plant>(1, {
      include: ['monitorPlans'],
      monitorPlanAmount: 3,
      monitorPlanConfig: {
        include: ['beginRptPeriod'],
      },
    });
    plantMock[0].monitorPlans[0].beginRptPeriod.year = emissionsDtoMock[0].year;
    plantMock[0].monitorPlans[0].beginRptPeriod.quarter =
      emissionsDtoMock[0].quarter;

    jest
      .spyOn(plantRepository, 'getImportLocations')
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

    await expect(
      emissionsService.importDailyTestSummaries(
        emissionsDtoMock[0],
        faker.datatype.number(),
        faker.datatype.string(),
        { monitoringSystems: {}, components: {}, monitorFormulas: {} },
      ),
    ).resolves.toBeUndefined();

    await expect(
      emissionsService.importDailyTestSummaries(
        dtoMockWithDailyTest[0],
        faker.datatype.number(),
        faker.datatype.string(),
        { monitoringSystems: {}, components: {}, monitorFormulas: {} },
      ),
    ).resolves;
  });
});
