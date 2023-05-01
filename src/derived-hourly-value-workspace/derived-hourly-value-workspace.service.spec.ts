import { Test, TestingModule } from '@nestjs/testing';
import { DerivedHourlyValueWorkspaceService } from './derived-hourly-value-workspace.service';
import { DerivedHourlyValueWorkspaceRepository } from './derived-hourly-value-workspace.repository';
import { genDerivedHrlyValues } from '../../test/object-generators/derived-hourly-value';
import { DerivedHourlyValueMap } from '../maps/derived-hourly-value.map';
import { mockDerivedHourlyValueWorkspaceRepository } from '../../test/mocks/mock-derived-hourly-value-workspace-repository';
import { DerivedHrlyValue } from '../entities/workspace/derived-hrly-value.entity';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { DerivedHourlyValueImportDTO } from '../dto/derived-hourly-value.dto';

const writeObjectMock = jest.fn();

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
        {
          provide: BulkLoadService,
          useFactory: () => ({
            startBulkLoader: jest.fn().mockResolvedValue({
              writeObject: writeObjectMock,
              complete: jest.fn(),
              finished: true,
            }),
          }),
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

  // describe('import', () => {
  //   it('should simulate the import of 2 new records', async () => {
  //     const params = [
  //       new DerivedHourlyValueImportDTO(),
  //       new DerivedHourlyValueImportDTO(),
  //     ];

  //     await service.import(params, '', '', 1, {
  //       components: {},
  //       userId: '',
  //       monitorFormulas: {},
  //       monitoringSystems: {},
  //     });

  //     expect(writeObjectMock).toHaveBeenCalledTimes(2);
  //   });
  // });
});
