import { Test } from '@nestjs/testing';
import { EntityManager } from 'typeorm';

import { mockWeeklyTestSummaryRepository } from '../../test/mocks/mock-weekly-test-summary-repository';
import { genWeeklyTestSumValues } from '../../test/object-generators/weekly-test-summary';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { WeeklyTestSummary } from '../entities/weekly-test-summary.entity';
import { WeeklySystemIntegrityMap } from '../maps/weekly-system-integrity.map';
import { WeeklyTestSummaryMap } from '../maps/weekly-test-summary.map';
import { WeeklySystemIntegrityRepository } from '../weekly-system-integrity/weekly-system-integrity.repository';
import { WeeklySystemIntegrityService } from '../weekly-system-integrity/weekly-system-integrity.service';
import { WeeklyTestSummaryRepository } from './weekly-test-summary.repository';
import { WeeklyTestSummaryService } from './weekly-test-summary.service';

describe('--WeeklyTestSummaryService--', () => {
  let map: WeeklyTestSummaryMap;
  let repository: WeeklyTestSummaryRepository;
  let weeklySystemIntegrityService: WeeklySystemIntegrityService;
  let service: WeeklyTestSummaryService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EntityManager,
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
