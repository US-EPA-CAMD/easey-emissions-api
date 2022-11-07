import { Test, TestingModule } from '@nestjs/testing';
import { DerivedHourlyValueService } from './derived-hourly-value.service';
import { DerivedHourlyValueRepository } from './derived-hourly-value.repository';
import {
  genDerivedHourlyValueParamsDto,
  genDerivedHrlyValues,
} from '../../test/object-generators/derived-hourly-value';
import { DerivedHourlyValueMap } from '../maps/derived-hourly-value.map';
import { mockDerivedHourlyValueRepository } from '../../test/mocks/mock-derived-hourly-value-repository';
import { DerivedHrlyValue } from '../entities/derived-hrly-value.entity';

describe('DerivedHourlyValueService', () => {
  let map: DerivedHourlyValueMap;
  let repository: DerivedHourlyValueRepository;
  let service: DerivedHourlyValueService;
  let exportModule: typeof import('../derived-hourly-value-functions/derived-hourly-value-export');

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

    exportModule = await import(
      '../derived-hourly-value-functions/derived-hourly-value-export'
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should export derived hourly values from service', async function() {
    const mockedValues = genDerivedHrlyValues<DerivedHrlyValue>(3, {
      include: ['monitorSystem'],
    });
    const promises = [];
    mockedValues.forEach(value => {
      promises.push(map.one(value));
    });
    const mappedValues = await Promise.all(promises);

    jest.spyOn(repository, 'export').mockResolvedValue(mockedValues);

    await expect(
      service.export(
        mockedValues.map(value => {
          return value.hourId;
        }),
      ),
    ).resolves.toEqual(mappedValues);
  });

  it('should export supplementary derived hourly values', async function() {
    const params = genDerivedHourlyValueParamsDto()[0];
    const results = genDerivedHrlyValues<DerivedHrlyValue>(3);
    const mapped = new DerivedHourlyValueMap().many(results);

    jest
      .spyOn(exportModule, 'exportSupplementaryDerivedHourlyValuesQuery')
      .mockResolvedValue(results);

    await expect(service.supplementaryExport(params)).toEqual(mapped);
  });
});
