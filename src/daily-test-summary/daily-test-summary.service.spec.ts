import { Test } from '@nestjs/testing';

import { DailyTestSummaryService } from './daily-test-summary.service';
import { DailyTestSummaryMap } from '../maps/daily-test-summary.map';
import { DailyCalibrationService } from '../daily-calibration/daily-calibration.service';
import { DailyCalibrationRepository } from '../daily-calibration/daily-calibration.repository';
import { DailyCalibrationMap } from '../maps/daily-calibration.map';
import { DailyTestSummaryRepository } from './daily-test-summary.repository';
import { mockDailyTestSummaryRepository } from '../../test/mocks/mock-daily-test-summary-repository';
import { genDailyTestSummary } from '../../test/object-generators/daily-test-summary';
import { DailyTestSummary } from '../entities/workspace/daily-test-summary.entity';
import { mockDailyCalibrationRepository } from '../../test/mocks/mock-daily-calibration-repository';

describe('HourlyOperatingService', () => {
  let service: DailyTestSummaryService;
  let repository: DailyTestSummaryRepository;
  let map: DailyTestSummaryMap;
  let dailyCalibrationRepository: DailyCalibrationRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DailyTestSummaryService,
        DailyTestSummaryMap,
        DailyCalibrationService,
        DailyCalibrationRepository,
        DailyCalibrationMap,
        {
          provide: DailyTestSummaryRepository,
          useValue: mockDailyTestSummaryRepository,
        },
        {
          provide: DailyCalibrationRepository,
          useValue: mockDailyCalibrationRepository,
        },
      ],
    }).compile();

    service = module.get(DailyTestSummaryService);
    repository = module.get(DailyTestSummaryRepository);
    map = module.get(DailyTestSummaryMap);
    dailyCalibrationRepository = module.get(DailyCalibrationRepository);
  });

  it('should have a defined service', function() {
    expect(service).toBeDefined();
  });

  it('should get daily test summaries by location ids', async function() {
    const mockedValues = genDailyTestSummary<DailyTestSummary>(3, {
      include: ['monitorLocation'],
    });
    const promises = [];
    mockedValues.forEach(value => {
      promises.push(map.one(value));
    });
    const mappedValues = await Promise.all(promises);

    jest.spyOn(repository, 'export').mockResolvedValue(mockedValues);

    await expect(
      service.getDailyTestSummariesByLocationIds(
        mockedValues.map(value => {
          return value.monitorLocation.id;
        }),
      ),
    ).resolves.toEqual(mappedValues);
  });

  it('should export mapped data', async function() {
    const dailyTestSummaryMocks = genDailyTestSummary<DailyTestSummary>(3);
    const mappedValues = await map.many(dailyTestSummaryMocks);

    jest.spyOn(repository, 'export').mockResolvedValue(dailyTestSummaryMocks);
    jest.spyOn(dailyCalibrationRepository, 'find').mockResolvedValue(null);

    await expect(service.export([])).resolves.toEqual(mappedValues);
  });
});
