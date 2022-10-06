import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EmissionsRepository } from './emissions.repository';
import { EmissionsService } from './emissions.service';
import { EmissionsMap } from '../maps/emissions.map';
import { DailyTestSummaryMap } from '../maps/daily-test-summary.map';
import { DailyCalibrationMap } from '../maps/daily-calibration.map';
import { PlantRepository } from '../plant/plant.repository';
import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import { MonitorHourlyValueMap } from '../maps/monitor-hourly-value.map';
import { DailyTestSummaryService } from '../daily-test-summary/daily-test-summary.service';
import { DailyCalibrationService } from '../daily-calibration/daily-calibration.service';
import { HourlyOperatingService } from '../hourly-operating/hourly-operating.service';
import { MonitorHourlyValueService } from '../monitor-hourly-value/monitor-hourly-value.service';
import { DailyTestSummaryRepository } from '../daily-test-summary/daily-test-summary.repository';
import { DailyCalibrationRepository } from '../daily-calibration/daily-calibration.repository';
import { HourlyOperatingRepository } from '../hourly-operating/hourly-operating.repository';
import { MonitorHourlyValueRepository } from '../monitor-hourly-value/monitor-hourly-value.repository';
import { EmissionsSubmissionsProgressMap } from '../maps/emissions-submissions-progress.map';
import { EmissionsSubmissionsProgressRepository } from './emissions-submissions-progress.repository';
import { MatsMonitorHourlyValueMap } from '../maps/mats-monitor-hourly-value.map';
import { MatsMonitorHourlyValueService } from '../mats-monitor-hourly-value/mats-monitor-hourly-value.service';
import { MatsMonitorHourlyValueRepository } from '../mats-monitor-hourly-value/mats-monitor-hourly-value.repository';
// import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { MatsDerivedHourlyValueMap } from '../maps/mats-derived-hourly-value.map';
import { MatsDerivedHourlyValueService } from '../mats-derived-hourly-value/mats-derived-hourly-value.service';
import { MatsDerivedHourlyValueRepository } from '../mats-derived-hourly-value/mats-derived-hourly-value.repository';
import { DerivedHourlyValueService } from '../derived-hourly-value/derived-hourly-value.service';
import { DerivedHourlyValueRepository } from '../derived-hourly-value/derived-hourly-value.repository';
import { DerivedHourlyValueMap } from '../maps/derived-hourly-value.map';
import { mockPlantRepository } from '../../test/mocks/plant-repository';
import { mockEmissionsRepository } from '../../test/mocks/emissions-repository';
import { genEmissionEvaluation } from '../../test/object-generators/emission-evaluation';
import { EmissionEvaluation } from '../entities/emission-evaluation.entity';
import {
  genEmissionsParamsDto,
  genEmissionsRecordDto,
} from '../../test/object-generators/emissions-dto';
import { EmissionsSubmissionsProgress } from '../entities/vw-emissions-submissions-progress.entity';
import { mockEmissionsSubmissionsProgressRepository } from '../../test/mocks/emissions-submissions-progress-repository';
import { genEmissionsSubmissionsProgress } from '../../test/object-generators/emissions-submissions-progress';
import { faker } from '@faker-js/faker';
import { mockDailyTestSummaryRepository } from '../../test/mocks/mock-daily-test-summary-repository';
import { mockHourlyOperatingRepository } from '../../test/mocks/hourly-operating-repository';
import { HourlyGasFlowMeterService } from '../hourly-gas-flow-meter/hourly-gas-flow-meter.service';
import { HourlyGasFlowMeterMap } from '../maps/hourly-gas-flow-meter.map';
import { HourlyGasFlowMeterRepository } from '../hourly-gas-flow-meter/hourly-gas-flow-meter.repository';
import { mockHourlyGasFlowMeterRepository } from '../../test/mocks/mock-hourly-gas-flow-meter-repository';
import { HourlyFuelFlowService } from '../hourly-fuel-flow/hourly-fuel-flow.service';
import { HourlyFuelFlowRepository } from '../hourly-fuel-flow/hourly-fuel-flow.repository';
import { HourlyFuelFlowMap } from '../maps/hourly-fuel-flow-map';
import { HourlyParameterFuelFlowService } from '../hourly-parameter-fuel-flow/hourly-parameter-fuel-flow.service';
import { HourlyParameterFuelFlowMap } from '../maps/hourly-parameter-fuel-flow.map';
import { HourlyParameterFuelFlowRepository } from '../hourly-parameter-fuel-flow/hourly-parameter-fuel-flow.repository';
import { DailyEmissionService } from '../daily-emission/daily-emission.service';
import { DailyEmissionMap } from '../maps/daily-emission.map';
import { DailyEmissionRepository } from '../daily-emission/daily-emission.repository';
import { DailyFuelService } from '../daily-fuel/daily-fuel.service';
import { DailyFuelMap } from '../maps/daily-fuel.map';
import { DailyFuelRepository } from '../daily-fuel/daily-fuel.repository';
import { SorbentTrapRepository } from '../sorbent-trap/sorbent-trap.repository';
import { SorbentTrapService } from '../sorbent-trap/sorbent-trap.service';
import { SamplingTrainService } from '../sampling-train/sampling-train.service';
import { SamplingTrainRepository } from '../sampling-train/sampling-train.repository';
import { Nsps4tSummaryService } from '../nsps4t-summary/nsps4t-summary.service';
import { Nsps4tSummaryRepository } from '../nsps4t-summary/nsps4t-summary.repository';
import { Nsps4tAnnualService } from '../nsps4t-annual/nsps4t-annual.service';
import { Nsps4tAnnualRepository } from '../nsps4t-annual/nsps4t-annual.repository';
import { Nsps4tCompliancePeriodService } from '../nsps4t-compliance-period/nsps4t-compliance-period.service';
import { Nsps4tCompliancePeriodRepository } from '../nsps4t-compliance-period/nsps4t-compliance-period.repository';

describe('Emissions Service', () => {
  let configService: ConfigService;
  let emissionsMap: EmissionsMap;
  let emissionsRepository: EmissionsRepository;
  let emissionsService: EmissionsService;
  let submissionProgressRepository: EmissionsSubmissionsProgressRepository;
  let submissionProgressMap: EmissionsSubmissionsProgressMap;
  let dailyTestSummaryService: DailyTestSummaryService;
  let hourlyOperatingService: HourlyOperatingService;
  let dailyEmissionService: DailyEmissionService;
  let sorbentTrapService: SorbentTrapService;
  let nsps4tSummaryService: Nsps4tSummaryService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DerivedHourlyValueMap,
        DerivedHourlyValueService,
        EmissionsService,
        DailyTestSummaryService,
        DailyCalibrationService,
        EmissionsMap,
        DailyTestSummaryMap,
        DailyCalibrationMap,
        DailyEmissionService,
        DailyEmissionMap,
        DailyEmissionRepository,
        DailyFuelService,
        DailyFuelMap,
        DailyFuelRepository,
        HourlyOperatingMap,
        MonitorHourlyValueMap,
        HourlyOperatingService,
        MonitorHourlyValueService,
        EmissionsSubmissionsProgress,
        EmissionsSubmissionsProgressMap,
        ConfigService,
        MatsMonitorHourlyValueMap,
        MatsMonitorHourlyValueService,
        MatsDerivedHourlyValueMap,
        MatsDerivedHourlyValueService,
        HourlyGasFlowMeterService,
        HourlyGasFlowMeterMap,
        HourlyFuelFlowService,
        HourlyFuelFlowRepository,
        HourlyFuelFlowMap,
        HourlyParameterFuelFlowService,
        HourlyParameterFuelFlowMap,
        HourlyParameterFuelFlowRepository,
        SorbentTrapService,
        SorbentTrapRepository,
        SamplingTrainService,
        SamplingTrainRepository,
        Nsps4tAnnualService,
        Nsps4tAnnualRepository,
        Nsps4tCompliancePeriodService,
        Nsps4tCompliancePeriodRepository,
        Nsps4tSummaryService,
        Nsps4tSummaryRepository,
        {
          provide: DerivedHourlyValueRepository,
          useValue: jest,
        },
        {
          provide: PlantRepository,
          useValue: mockPlantRepository,
        },
        {
          provide: EmissionsRepository,
          useValue: mockEmissionsRepository,
        },
        {
          provide: DailyTestSummaryRepository,
          useValue: mockDailyTestSummaryRepository,
        },
        {
          provide: DailyCalibrationRepository,
          useValue: jest.mock(
            '../daily-calibration/daily-calibration.repository',
          ),
        },
        {
          provide: HourlyOperatingRepository,
          useValue: mockHourlyOperatingRepository,
        },
        {
          provide: MonitorHourlyValueRepository,
          useValue: jest.mock(
            '../monitor-hourly-value/monitor-hourly-value.repository',
          ),
        },
        {
          provide: MatsMonitorHourlyValueRepository,
          useValue: jest.mock(
            '../mats-monitor-hourly-value/mats-monitor-hourly-value.repository',
          ),
        },
        {
          provide: MatsDerivedHourlyValueRepository,
          useValue: jest.mock(
            '../mats-derived-hourly-value/mats-derived-hourly-value.repository',
          ),
        },
        {
          provide: HourlyGasFlowMeterRepository,
          useValue: mockHourlyGasFlowMeterRepository,
        },
        {
          provide: EmissionsSubmissionsProgressRepository,
          useValue: mockEmissionsSubmissionsProgressRepository,
        },
      ],
    }).compile();

    configService = module.get(ConfigService);
    emissionsRepository = module.get(EmissionsRepository);
    emissionsService = module.get(EmissionsService);
    emissionsMap = module.get(EmissionsMap);
    submissionProgressRepository = module.get(
      EmissionsSubmissionsProgressRepository,
    );
    submissionProgressMap = module.get(EmissionsSubmissionsProgressMap);
    dailyTestSummaryService = module.get(DailyTestSummaryService);
    hourlyOperatingService = module.get(HourlyOperatingService);
    dailyEmissionService = module.get(DailyEmissionService);
    sorbentTrapService = module.get(SorbentTrapService);
    nsps4tSummaryService = module.get(Nsps4tSummaryService);
  });

  it('should have a emissions service', function() {
    expect(emissionsService).toBeDefined();
  });

  describe('export', () => {
    it('should export a record', async () => {
      const emissionsMocks = genEmissionEvaluation<EmissionEvaluation>(1, {
        include: ['monitorPlan'],
        monitorPlanConfig: {
          include: ['locations'],
          monitorLocationAmount: 3,
        },
      });

      const dtoMocks = genEmissionsRecordDto();
      const mappedEmissions = await emissionsMap.one(emissionsMocks[0]);
      mappedEmissions.dailyTestSummaryData = null;
      mappedEmissions.hourlyOperatingData = null;

      jest
        .spyOn(emissionsRepository, 'export')
        .mockResolvedValue(emissionsMocks[0]);
      jest.spyOn(dailyTestSummaryService, 'export').mockResolvedValue(null);
      jest.spyOn(hourlyOperatingService, 'export').mockResolvedValue(null);
      jest.spyOn(dailyEmissionService, 'export').mockResolvedValue(null);
      jest.spyOn(sorbentTrapService, 'export').mockResolvedValue(null);
      jest.spyOn(nsps4tSummaryService, 'export').mockResolvedValue(null);

      await expect(emissionsService.export(dtoMocks[0])).resolves.toEqual(
        mappedEmissions,
      );
    });

    it('should return an empty object if no emissions data is found', async function() {
      const dtoMock = genEmissionsParamsDto();

      jest.spyOn(emissionsRepository, 'export').mockResolvedValue(undefined);

      await expect(emissionsService.export(dtoMock[0])).resolves.toEqual({});
    });
  });

  describe('get submission progress', () => {
    it('should get submission progress', async function() {
      const mockedProgress = genEmissionsSubmissionsProgress<
        EmissionsSubmissionsProgress
      >();
      jest
        .spyOn(submissionProgressRepository, 'getSubmissionProgress')
        .mockResolvedValue(mockedProgress[0]);

      const mapped = await submissionProgressMap.one(mockedProgress[0]);

      await expect(
        emissionsService.getSubmissionProgress(faker.date.soon()),
      ).resolves.toEqual(mapped);
    });

    it('should return undefined if not query result is found', async function() {
      jest
        .spyOn(submissionProgressRepository, 'getSubmissionProgress')
        .mockResolvedValue(undefined);

      await expect(
        emissionsService.getSubmissionProgress(faker.date.soon()),
      ).resolves.toEqual(undefined);
    });
  });
});
