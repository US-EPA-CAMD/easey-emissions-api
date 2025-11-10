import { Test } from '@nestjs/testing';
import { DataSource, EntityManager } from 'typeorm';

import { mockDailyCalibrationRepository } from '../../test/mocks/mock-daily-calibration-repository';
import { mockDailyTestSummaryRepository } from '../../test/mocks/mock-daily-test-summary-repository';
import { genDailyTestSummary } from '../../test/object-generators/daily-test-summary';
import { genEmissionsParamsDto } from '../../test/object-generators/emissions-dto';
import { DailyCalibrationService } from '../daily-calibration/daily-calibration.service';
import { DailyTestSummary } from '../entities/daily-test-summary.entity';
import { DailyCalibrationMap } from '../maps/daily-calibration.map';
import { DailyTestSummaryMap } from '../maps/daily-test-summary.map';
import { DailyTestSummaryService } from './daily-test-summary.service';

jest.mock('./daily-test-summary.repository', () => ({
  DailyTestSummaryRepository: jest.fn().mockImplementation(() => mockDailyTestSummaryRepository),
}));

jest.mock('../daily-calibration/daily-calibration.repository', () => ({
  DailyCalibrationRepository: jest.fn().mockImplementation(() => mockDailyCalibrationRepository),
}));

describe('Daily Test Summary Service', () => {
  let service: DailyTestSummaryService;
  let repository: any;
  let map: DailyTestSummaryMap;
  let dailyCalibrationRepository: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DailyTestSummaryService,
        DailyTestSummaryMap,
        DailyCalibrationService,
        // DailyCalibrationRepository,
        DailyCalibrationMap,
        EntityManager,
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
              isReleased: false,
            }),
          },
        }
      ],
    }).compile();

    service = module.get(DailyTestSummaryService);
    repository = mockDailyTestSummaryRepository;
    map = module.get(DailyTestSummaryMap);
    dailyCalibrationRepository = mockDailyCalibrationRepository;
  });

  it('should have a defined service', function () {
    expect(service).toBeDefined();
  });

  it('should get daily test summaries by location ids', async function () {
    const mockedValues = genDailyTestSummary<DailyTestSummary>(3, {
      include: ['monitorLocation'],
    });
    const promises = [];
    mockedValues.forEach(value => {
      promises.push(map.one(value));
    });
    const mappedValues = await Promise.all(promises);

    jest
      .spyOn(repository, 'export')
      .mockResolvedValue(mockedValues as DailyTestSummary[]);

    await expect(
      service.getDailyTestSummariesByLocationIds(
        mockedValues.map(value => {
          return value.monitorLocation.id;
        }),
        genEmissionsParamsDto()[0],
      ),
    ).resolves.toEqual(mappedValues);
  });

  it('should export mapped data', async function () {
    const dailyTestSummaryMocks = genDailyTestSummary<DailyTestSummary>(3);
    const mappedValues = await map.many(dailyTestSummaryMocks);

    jest.spyOn(repository, 'export').mockResolvedValue(dailyTestSummaryMocks);
    jest.spyOn(dailyCalibrationRepository, 'find').mockResolvedValue(null);

    await expect(
      service.export([], genEmissionsParamsDto()[0]),
    ).resolves.toEqual(mappedValues);
  });
});
