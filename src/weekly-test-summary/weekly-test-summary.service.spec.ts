import { Test } from '@nestjs/testing';
import { WeeklyTestSummaryMap } from '../maps/weekly-test-summary.map';
import { WeeklyTestSummaryRepository } from './weekly-test-summary.repository';
import { WeeklyTestSummaryService } from './weekly-test-summary.service';
import { mockWeeklyTestSummaryRepository } from '../../test/mocks/mock-weekly-test-summary-repository';
import { genWeeklyTestSumValues } from '../../test/object-generators/weekly-test-summary';
import { WeeklyTestSummary } from '../entities/weekly-test-summary.entity';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { WeeklySystemIntegrityService } from '../weekly-system-integrity/weekly-system-integrity.service';
import { WeeklySystemIntegrityMap } from '../maps/weekly-system-integrity.map';
import { WeeklySystemIntegrityRepository } from '../weekly-system-integrity/weekly-system-integrity.repository';

describe('--WeeklyTestSummaryService--', () => {
  let map: WeeklyTestSummaryMap;
  let repository: WeeklyTestSummaryRepository;
  let weeklySystemIntegrityService: WeeklySystemIntegrityService;
  let service: WeeklyTestSummaryService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        WeeklyTestSummaryMap,
        WeeklyTestSummaryService,
        WeeklySystemIntegrityService,
        WeeklySystemIntegrityMap,
        WeeklySystemIntegrityRepository,
        {
          provide: WeeklyTestSummaryRepository,
          useValue: mockWeeklyTestSummaryRepository,
        },
      ],
    }).compile();

    map = module.get(WeeklyTestSummaryMap);
    repository = module.get(WeeklyTestSummaryRepository);
    service = module.get(WeeklyTestSummaryService);
    weeklySystemIntegrityService = module.get(WeeklySystemIntegrityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('export', () => {
    it('returns export record for weekly test summary data', async () => {
      const mockedValues = genWeeklyTestSumValues<WeeklyTestSummary>(3, {
        include: ['weeklySystemIntegrityData'],
      });
      const promises = [];
      const params = new EmissionsParamsDTO();
      mockedValues.forEach(value => {
        promises.push(map.one(value));
      });
      const mappedValues = await Promise.all(promises);
      jest.spyOn(repository, 'export').mockResolvedValue(mockedValues);
      jest
        .spyOn(weeklySystemIntegrityService, 'export')
        .mockResolvedValue(undefined);

      await expect(
        service.export(
          mockedValues.map(value => {
            return value.id;
          }),
          params,
        ),
      ).resolves.toEqual(mappedValues);
    });
  });
});
