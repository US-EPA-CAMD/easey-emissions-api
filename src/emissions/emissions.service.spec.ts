import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';

import { DailyCalibrationRepository } from '../daily-calibration/daily-calibration.repository';
import { DailyCalibrationService } from '../daily-calibration/daily-calibration.service';
import { DailyTestSummaryRepository } from '../daily-test-summary/daily-test-summary.repository';
import { DailyTestSummaryService } from '../daily-test-summary/daily-test-summary.service';
import { HourlyOperatingRepository } from '../hourly-operating/hourly-operating.repository';
import { HourlyOperatingService } from '../hourly-operating/hourly-operating.service';
import { DailyCalibrationMap } from '../maps/daily-calibration.map';
import { DailyTestSummaryMap } from '../maps/daily-test-summary.map';
import { EmissionsSubmissionsProgressMap } from '../maps/emissions-submissions-progress.map';
import { EmissionsMap } from '../maps/emissions.map';
import { HourlyOperatingMap } from '../maps/hourly-operating.map';
import { MatsMonitorHourlyValueMap } from '../maps/mats-monitor-hourly-value.map';
import { MonitorHourlyValueMap } from '../maps/monitor-hourly-value.map';
import { MatsMonitorHourlyValueRepository } from '../mats-monitor-hourly-value/mats-monitor-hourly-value.repository';
import { MatsMonitorHourlyValueService } from '../mats-monitor-hourly-value/mats-monitor-hourly-value.service';
import { MonitorHourlyValueRepository } from '../monitor-hourly-value/monitor-hourly-value.repository';
import { MonitorHourlyValueService } from '../monitor-hourly-value/monitor-hourly-value.service';
import { PlantRepository } from '../plant/plant.repository';
import { EmissionsSubmissionsProgressRepository } from './emissions-submissions-progress.repository';
import { EmissionsRepository } from './emissions.repository';
import { EmissionsService } from './emissions.service';
// import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { mockEmissionsRepository } from '../../test/mocks/emissions-repository';
import { mockEmissionsSubmissionsProgressRepository } from '../../test/mocks/emissions-submissions-progress-repository';
import { mockHourlyOperatingRepository } from '../../test/mocks/hourly-operating-repository';
import { mockDailyTestSummaryRepository } from '../../test/mocks/mock-daily-test-summary-repository';
import { mockHourlyGasFlowMeterRepository } from '../../test/mocks/mock-hourly-gas-flow-meter-repository';
import { mockLongTermFuelFlowRepository } from '../../test/mocks/mock-long-term-fuel-flow-repository';
import { mockPlantRepository } from '../../test/mocks/plant-repository';
import { genEmissionEvaluation } from '../../test/object-generators/emission-evaluation';
import {
  genEmissionsParamsDto,
  genEmissionsRecordDto,
} from '../../test/object-generators/emissions-dto';
import { DailyBackstopRepository } from '../daily-backstop/daily-backstop.repository';
import { DailyBackstopService } from '../daily-backstop/daily-backstop.service';
import { DailyEmissionRepository } from '../daily-emission/daily-emission.repository';
import { DailyEmissionService } from '../daily-emission/daily-emission.service';
import { DailyFuelRepository } from '../daily-fuel/daily-fuel.repository';
import { DailyFuelService } from '../daily-fuel/daily-fuel.service';
import { DerivedHourlyValueRepository } from '../derived-hourly-value/derived-hourly-value.repository';
import { DerivedHourlyValueService } from '../derived-hourly-value/derived-hourly-value.service';
import { EmissionEvaluation } from '../entities/emission-evaluation.entity';
import { EmissionsSubmissionsProgress } from '../entities/vw-emissions-submissions-progress.entity';
import { HourlyFuelFlowRepository } from '../hourly-fuel-flow/hourly-fuel-flow.repository';
import { HourlyFuelFlowService } from '../hourly-fuel-flow/hourly-fuel-flow.service';
import { HourlyGasFlowMeterRepository } from '../hourly-gas-flow-meter/hourly-gas-flow-meter.repository';
import { HourlyGasFlowMeterService } from '../hourly-gas-flow-meter/hourly-gas-flow-meter.service';
import { HourlyParameterFuelFlowRepository } from '../hourly-parameter-fuel-flow/hourly-parameter-fuel-flow.repository';
import { HourlyParameterFuelFlowService } from '../hourly-parameter-fuel-flow/hourly-parameter-fuel-flow.service';
import { LongTermFuelFlowRepository } from '../long-term-fuel-flow/long-term-fuel-flow.repository';
import { LongTermFuelFlowService } from '../long-term-fuel-flow/long-term-fuel-flow.service';
import { DailyBackstopMap } from '../maps/daily-backstop.map';
import { DailyEmissionMap } from '../maps/daily-emission.map';
import { DailyFuelMap } from '../maps/daily-fuel.map';
import { DerivedHourlyValueMap } from '../maps/derived-hourly-value.map';
import { HourlyFuelFlowMap } from '../maps/hourly-fuel-flow-map';
import { HourlyGasFlowMeterMap } from '../maps/hourly-gas-flow-meter.map';
import { HourlyParameterFuelFlowMap } from '../maps/hourly-parameter-fuel-flow.map';
import { LongTermFuelFlowMap } from '../maps/long-term-fuel-flow.map';
import { MatsDerivedHourlyValueMap } from '../maps/mats-derived-hourly-value.map';
import { SummaryValueMap } from '../maps/summary-value.map';
import { WeeklySystemIntegrityMap } from '../maps/weekly-system-integrity.map';
import { WeeklyTestSummaryMap } from '../maps/weekly-test-summary.map';
import { MatsDerivedHourlyValueRepository } from '../mats-derived-hourly-value/mats-derived-hourly-value.repository';
import { MatsDerivedHourlyValueService } from '../mats-derived-hourly-value/mats-derived-hourly-value.service';
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
import { EaseyContentService } from '../emissions-easey-content/easey-content.service';

describe('Emissions Service', () => {
  let emissionsMap: EmissionsMap;
  let emissionsRepository: EmissionsRepository;
  let emissionsSubmissionsProgressRepository: EmissionsSubmissionsProgressRepository;
  let emissionsService: EmissionsService;
  let dailyTestSummaryService: DailyTestSummaryService;
  let hourlyOperatingService: HourlyOperatingService;
  let dailyEmissionService: DailyEmissionService;
  let sorbentTrapService: SorbentTrapService;
  let weeklyTestSummaryService: WeeklyTestSummaryService;
  let nsps4tSummaryService: Nsps4tSummaryService;
  let summaryValueService: SummaryValueService;
  let longTermFuelFlowService: LongTermFuelFlowService;
  let configService: ConfigService;
  let dailyBackstopService: DailyBackstopService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EntityManager,
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
        WeeklyTestSummaryRepository,
        WeeklyTestSummaryService,
        WeeklyTestSummaryMap,
        WeeklySystemIntegrityService,
        WeeklySystemIntegrityRepository,
        WeeklySystemIntegrityMap,
        Nsps4tAnnualService,
        Nsps4tAnnualRepository,
        Nsps4tCompliancePeriodService,
        Nsps4tCompliancePeriodRepository,
        Nsps4tSummaryService,
        Nsps4tSummaryRepository,
        SummaryValueService,
        SummaryValueRepository,
        SummaryValueMap,
        LongTermFuelFlowMap,
        LongTermFuelFlowService,
        DailyBackstopService,
        DailyBackstopMap,
        {
          provide: LongTermFuelFlowRepository,
          useValue: mockLongTermFuelFlowRepository,
        },
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
        {
          provide: DailyBackstopRepository,
          useValue: jest.mock('../daily-backstop/daily-backstop.repository'),
        },
        {
          provide: EaseyContentService,
          useFactory:  () => ({
            emissionsSchema: jest.fn().mockResolvedValue({
              version : '1.0.0'
            }),
          })
        }
      ],
    }).compile();

    emissionsRepository = module.get(EmissionsRepository);
    emissionsService = module.get(EmissionsService);
    emissionsMap = module.get(EmissionsMap);
    dailyTestSummaryService = module.get(DailyTestSummaryService);
    hourlyOperatingService = module.get(HourlyOperatingService);
    dailyEmissionService = module.get(DailyEmissionService);
    sorbentTrapService = module.get(SorbentTrapService);
    weeklyTestSummaryService = module.get(WeeklyTestSummaryService);
    nsps4tSummaryService = module.get(Nsps4tSummaryService);
    summaryValueService = module.get(SummaryValueService);
    emissionsSubmissionsProgressRepository = module.get(
      EmissionsSubmissionsProgressRepository,
    );
    longTermFuelFlowService = module.get(LongTermFuelFlowService);
    configService = module.get(ConfigService);
    dailyBackstopService = module.get(DailyBackstopService);
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
      mappedEmissions.dailyTestSummaryData = [];
      mappedEmissions.hourlyOperatingData = [];
      mappedEmissions.dailyBackstopData = [];

      jest
        .spyOn(emissionsRepository, 'export')
        .mockResolvedValue(emissionsMocks[0]);
      jest.spyOn(dailyTestSummaryService, 'export').mockResolvedValue(null);
      jest.spyOn(hourlyOperatingService, 'export').mockResolvedValue(null);
      jest.spyOn(dailyEmissionService, 'export').mockResolvedValue(null);
      jest.spyOn(sorbentTrapService, 'export').mockResolvedValue(null);
      jest.spyOn(weeklyTestSummaryService, 'export').mockResolvedValue(null);
      jest.spyOn(nsps4tSummaryService, 'export').mockResolvedValue(null);
      jest.spyOn(summaryValueService, 'export').mockResolvedValue(null);
      jest.spyOn(longTermFuelFlowService, 'export').mockResolvedValue(null);
      jest.spyOn(dailyBackstopService, 'export').mockResolvedValue(null);
      jest.spyOn(configService, 'get').mockReturnValue('test');

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

  describe('getSubmissionProgress', () => {
    it('should run successfully', async () => {
      jest
        .spyOn(emissionsSubmissionsProgressRepository, 'getSubmissionProgress')
        .mockResolvedValue(undefined);
      const result = await emissionsService.getSubmissionProgress(
        new Date('2022-10-10'),
      );
      expect(result.year).toBe(2022);
      expect(result.quarterName).toBe('Third');
      expect(result.quarter).toBe(3);
    });
  });
});
