import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { DerivedHourlyValueService } from './derived-hourly-value.service';
import { genDerivedHrlyValues } from '../../test/object-generators/derived-hourly-value';
import { DerivedHourlyValueMap } from '../maps/derived-hourly-value.map';
import { mockDerivedHourlyValueRepository } from '../../test/mocks/mock-derived-hourly-value-repository';
import { DerivedHrlyValue } from '../entities/derived-hrly-value.entity';

jest.mock('./derived-hourly-value.repository', () => ({
  DerivedHourlyValueRepository: jest.fn().mockImplementation(() => mockDerivedHourlyValueRepository),
}));

describe('DerivedHourlyValueService', () => {
  let map: DerivedHourlyValueMap;
  let repository: any;
  let service: DerivedHourlyValueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DerivedHourlyValueMap,
        DerivedHourlyValueService,
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
              manager: {
                connection: {},
                queryRunner: {},
              },
            }),
          },
        }
      ],
    }).compile();

    map = module.get(DerivedHourlyValueMap);
    repository = mockDerivedHourlyValueRepository
    service = module.get<DerivedHourlyValueService>(DerivedHourlyValueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should export derived hourly values from service', async function () {
    const mockedValues = genDerivedHrlyValues<DerivedHrlyValue>(3, {
      include: ['monitorSystem'],
    });
    const promises = [];
    mockedValues.forEach(value => {
      promises.push(map.one(value));
    });
    const mappedValues = await Promise.all(promises);

    jest.spyOn(repository, 'export').mockResolvedValue(mockedValues);

    await expect(service.export(123, ['123'])).resolves.toEqual(mappedValues);
  });
});
