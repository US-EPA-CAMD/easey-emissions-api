import { Test, TestingModule } from '@nestjs/testing';
import { DerivedHourlyValueWorkspaceService } from './derived-hourly-value-workspace.service';
import { DerivedHourlyValueWorkspaceRepository } from './derived-hourly-value-workspace.repository';
import { genDerivedHrlyValues } from '../../test/object-generators/derived-hourly-value';
import { DerivedHourlyValueMap } from '../maps/derived-hourly-value.map';
import { mockDerivedHourlyValueWorkspaceRepository } from '../../test/mocks/mock-derived-hourly-value-workspace-repository';
import { DerivedHrlyValue } from '../entities/workspace/derived-hrly-value.entity';
import { genDerivedHourlyValueImportDto } from '../../test/object-generators/derived-hourly-value-dto';

describe('DerivedHourlyValueWorkspaceService', () => {
  let map: DerivedHourlyValueMap;
  let repository: DerivedHourlyValueWorkspaceRepository;
  let service: DerivedHourlyValueWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DerivedHourlyValueMap,
        DerivedHourlyValueWorkspaceService,
        {
          provide: DerivedHourlyValueWorkspaceRepository,
          useValue: mockDerivedHourlyValueWorkspaceRepository,
        },
      ],
    }).compile();

    map = module.get(DerivedHourlyValueMap);
    repository = module.get(DerivedHourlyValueWorkspaceRepository);
    service = module.get<DerivedHourlyValueWorkspaceService>(
      DerivedHourlyValueWorkspaceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should export derived hourly values from workspace service', async function() {
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

  it('should import data given correct data', async function() {
    const mockedValues = genDerivedHourlyValueImportDto();

    jest.spyOn(service, 'import').mockResolvedValue(null);

    await expect(
      service.import(mockedValues[0], '123', '123', 123, {
        components: {},
        monitorFormulas: {},
        monitoringSystems: {},
      }),
    );
  });
});
