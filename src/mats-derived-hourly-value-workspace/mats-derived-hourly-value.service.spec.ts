import { Test } from '@nestjs/testing';
import { MatsDerivedHourlyValueMap } from '../maps/mats-derived-hourly-value.map';
import { MatsDerivedHourlyValueWorkspaceService } from './mats-derived-hourly-value.service';
import { MatsDerivedHourlyValueWorkspaceRepository } from './mats-derived-hourly-value.repository';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { MatsDerivedHourlyValueImportDTO } from '../dto/mats-derived-hourly-value.dto';
import { EntityManager, QueryRunner } from 'typeorm';

const mockRepository = {
  export: () => null,
  save: () => null,
  create: () => null,
  find: () => null,
};
const mockMap = {
  many: () => null,
};

const writeObjectMock = jest.fn();

const mockQueryRunner = {
  connect: jest.fn(),
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn(),
  manager: {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    query: jest.fn(),
  },
};

const mockEntityManager = {
  connection: {
    createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
  },
  transaction: jest.fn().mockImplementation(async (fn) => {
    return await fn(mockQueryRunner.manager);
  }),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
  query: jest.fn(),
};

describe('MatsDerivedHourlyValueWorkspaceService', () => {
  let service: MatsDerivedHourlyValueWorkspaceService;
  let repository: any;
  let map: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MatsDerivedHourlyValueWorkspaceService,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
        {
          provide: MatsDerivedHourlyValueMap,
          useValue: mockMap,
        },
        {
          provide: MatsDerivedHourlyValueWorkspaceRepository,
          useValue: mockRepository,
        },
        {
          provide: BulkLoadService,
          useFactory: () => ({
            startBulkLoader: jest.fn().mockImplementation(
                (_tableLocation, _columns, _delimiter, _queryRunner) => {
                  return {
                    writeObject: writeObjectMock,
                    complete: jest.fn(),
                    finished: Promise.resolve(true),
                    status: 'Complete',
                  };
                }
            ),
          }),
        },
      ],
    }).compile();

    service = module.get(MatsDerivedHourlyValueWorkspaceService);
    repository = module.get(MatsDerivedHourlyValueWorkspaceRepository);
    map = module.get(MatsDerivedHourlyValueMap);
  });

  describe('MATS Derived Hourly Value Export', () => {
    it('service should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should export a mats derived hourly value record', async () => {
      const result = await service.export(['123']);
      expect(result).toEqual(null);
    });
  });
  /*
  describe('MATS Derived Hourly Value Import', () => {
    it('should import a mats derived hourly value record', async () => {
      const params = [
        new MatsDerivedHourlyValueImportDTO(),
        new MatsDerivedHourlyValueImportDTO(),
      ];

      await service.import(params, '', '', 1, {
        components: {},
        userId: '',
        monitorFormulas: {},
        monitoringSystems: {},
      });

      expect(writeObjectMock).toHaveBeenCalledTimes(2);
    });
  });
  */
});
