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
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
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

const emissionsRepositoryMock = {
  export: jest.fn(),
};

describe('Emissions Workspace Service', () => {
  let emissionsService: EmissionsService;

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
        HourlyOperatingMap,
        MonitorHourlyValueMap,
        HourlyOperatingService,
        MonitorHourlyValueService,
        EmissionsSubmissionsProgressMap,
        EmissionsSubmissionsProgressRepository,
        ConfigService,
        MatsMonitorHourlyValueMap,
        MatsMonitorHourlyValueService,
        MatsDerivedHourlyValueMap,
        MatsDerivedHourlyValueService,
        {
          provide: DerivedHourlyValueRepository,
          useValue: jest,
        },
        {
          provide: PlantRepository,
          useValue: jest.mock('../plant/plant.repository'),
        },
        {
          provide: EmissionsRepository,
          useValue: emissionsRepositoryMock,
        },
        {
          provide: DailyTestSummaryRepository,
          useValue: jest.mock(
            '../daily-test-summary/daily-test-summary.repository',
          ),
        },
        {
          provide: DailyCalibrationRepository,
          useValue: jest.mock(
            '../daily-calibration/daily-calibration.repository',
          ),
        },
        {
          provide: HourlyOperatingRepository,
          useValue: jest.mock(
            '../hourly-operating/hourly-operating.repository',
          ),
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
      ],
    }).compile();

    emissionsService = module.get(EmissionsService);
  });

  it('should have a emissions service', function() {
    expect(emissionsService).toBeDefined();
  });

  it('should export a record', async () => {
    const filters = new EmissionsParamsDTO();
    await expect(emissionsService.export(filters)).resolves.toEqual({});
  });
});

// let mockResolvedEmissionsRepository = undefined;

// let configVals = {
//   ['app.env']: 'development',
// };

// let repoVals = {};

// describe('Emissions Service', () => {
//   let service: EmissionService;

//   beforeAll(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [LoggerModule],
//       providers: [
//         EmissionService,
//         EmissionSubmissionsProgressMap,
//         {
//           provide: ConfigService,
//           useValue: {
//             get: jest.fn((key: string) => {
//               return configVals[key];
//             }),
//           },
//         },
//         {
//           provide: EmissionsRepository,
//           useValue: {
//             getSubmissionProgress: jest.fn(() => {
//               return repoVals;
//             }),
//           },
//         },
//       ],
//     }).compile();

//     service = module.get(EmissionService);
//   });

//   it('should be defined', () => {
//     expect(EmissionService).toBeDefined();
//   });

//   describe('getSubmissionProgress', () => {
//     it('Given an undefined repo result, and a valid reporting month in quarter 4, return previous year and Fourth quarter', async () => {
//       repoVals = undefined;

//       const result = await service.getSubmissionProgress(
//         new Date('2020-01-01'),
//       );

//       expect(result.year).toEqual(2019);
//       expect(result.quarterName).toEqual('Fourth');
//     });

//     it('Given an undefined repo result, and a valid reporting month in quarter 1, return First quarter', async () => {
//       repoVals = undefined;

//       const result = await service.getSubmissionProgress(
//         new Date('2020-04-01'),
//       );

//       expect(result.quarterName).toEqual('First');
//     });

//     it('Given an undefined repo result, and a valid reporting month in quarter 2, return Second quarter', async () => {
//       repoVals = undefined;

//       const result = await service.getSubmissionProgress(
//         new Date('2020-07-01'),
//       );

//       expect(result.quarterName).toEqual('Second');
//     });

//     it('Given an undefined repo result, and a valid reporting month in quarter 3, return Third quarter', async () => {
//       repoVals = undefined;

//       const result = await service.getSubmissionProgress(
//         new Date('2020-10-01'),
//       );

//       expect(result.quarterName).toEqual('Third');
//     });

//     it('Given an undefined repo result, and a non valid reporting month, return undefined', async () => {
//       repoVals = undefined;

//       const result = await service.getSubmissionProgress(
//         new Date('2020-09-01'),
//       );

//       expect(result).toEqual(undefined);
//     });

//     it('Given an defined repo result, return the percentage', async () => {
//       repoVals = { percentage: 100, quarter: 1, calendarYear: 2020 };

//       const result = await service.getSubmissionProgress(
//         new Date('2020-09-01'),
//       );

//       expect(result.quarterName).toEqual('First');
//     });
//   });
// });
