import { Test } from '@nestjs/testing';
import { WeeklySystemIntegrity } from '../entities/weekly-system-integrity.entity';
import { WeeklySystemIntegrityMap } from '../maps/weekly-system-integrity.map';
import { WeeklySystemIntegrityRepository } from './weekly-system-integrity.repository';
import { WeeklySystemIntegrityService } from './weekly-system-integrity.service';
import { mockWeeklySystemIntegrityRepository } from '../../test/mocks/mock-weekly-system-integrity-repository';
import { genWeeklySystemIntegrity } from '../../test/object-generators/weekly-system-integrity';

describe('--WeeklySystemIntegrityService--', () => {
  let map: WeeklySystemIntegrityMap;
  let repository: WeeklySystemIntegrityRepository;
  let service: WeeklySystemIntegrityService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        WeeklySystemIntegrityMap,
        WeeklySystemIntegrityService,
        {
          provide: WeeklySystemIntegrityRepository,
          useValue: mockWeeklySystemIntegrityRepository,
        },
      ],
    }).compile();

    map = module.get(WeeklySystemIntegrityMap);
    repository = module.get(WeeklySystemIntegrityRepository);
    service = module.get(WeeklySystemIntegrityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('export', () => {
    it('returns export record for weekly system integrity data', async () => {
      const mockedValues = genWeeklySystemIntegrity<WeeklySystemIntegrity>(3);
      const promises = [];
      mockedValues.forEach(value => {
        promises.push(map.one(value));
      });
      jest.spyOn(repository, 'find').mockResolvedValue(mockedValues);
      const mappedValues = await Promise.all(promises);

      await expect(
        service.export(
          mockedValues.map(value => {
            return value.weeklyTestSumId;
          }),
        ),
      ).resolves.toEqual(mappedValues);
    });
  });
});
