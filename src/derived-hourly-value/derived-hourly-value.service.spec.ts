import { Test, TestingModule } from '@nestjs/testing';
import { DerivedHourlyValueService } from './derived-hourly-value.service';
import { DerivedHourlyValueRepository } from './derived-hourly-value.repository';
import { genDerivedHrlyValues } from '../tests/object-generators/derived-hourly-value';
import { DerivedHourlyValueMap } from '../maps/derived-hourly-value.map';
import { mockDerivedHourlyValueRepository } from '../tests/mocks/mock-derived-hourly-value-repository';

describe('DerivedHourlyValueService', () => {
  let map: DerivedHourlyValueMap;
  let repository: DerivedHourlyValueRepository;
  let service: DerivedHourlyValueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DerivedHourlyValueMap,
        DerivedHourlyValueService,
        {
          provide: DerivedHourlyValueRepository,
          useValue: mockDerivedHourlyValueRepository,
        },
      ],
    }).compile();

    map = module.get(DerivedHourlyValueMap);
    repository = module.get(DerivedHourlyValueRepository);
    service = module.get<DerivedHourlyValueService>(DerivedHourlyValueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should export derived hourly values from service', async function() {
    const mockedValues = genDerivedHrlyValues(5, {
      include: ['monitorSystem'],
    });
    const promises = [];
    mockedValues.forEach(value => {
      promises.push(map.one(value));
    });
    const mappedValues = await Promise.all(promises);

    jest.spyOn(repository, 'export').mockResolvedValue(mockedValues);

    await expect(service.export(['123', 'abc'])).resolves.toEqual(mappedValues);
  });
});
