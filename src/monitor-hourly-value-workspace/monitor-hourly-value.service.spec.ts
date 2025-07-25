import { Test } from '@nestjs/testing';
import { EntityManager, QueryRunner } from 'typeorm';


import { MonitorHourlyValueMap } from '../maps/monitor-hourly-value.map';
import { MonitorHourlyValueWorkspaceRepository } from './monitor-hourly-value.repository';
import { MonitorHourlyValueWorkspaceService } from './monitor-hourly-value.service';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import {MonitorHourlyValueImportDTO} from "../dto/monitor-hourly-value.dto";

const mockRepository = {
  export: () => null,
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

describe('MonitorHourlyValueWorkspaceService', () => {
  let service: MonitorHourlyValueWorkspaceService;
  let repository: MonitorHourlyValueWorkspaceRepository;
  let map: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MonitorHourlyValueWorkspaceService,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
        {
          provide: MonitorHourlyValueMap,
          useValue: mockMap,
        },
        {
          provide: MonitorHourlyValueWorkspaceRepository,
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

    service = module.get(MonitorHourlyValueWorkspaceService);
    repository = module.get(MonitorHourlyValueWorkspaceRepository);
    map = module.get(MonitorHourlyValueMap);
  });

  describe('export', () => {
    it('service should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should export a record', async () => {
      const result = await service.export(['123']);
      expect(result).toEqual(null);
    });
  });

  describe('import', () => {
    it('should simulate the import of 2 new records', async () => {
      const params = [
        new MonitorHourlyValueImportDTO(),
        new MonitorHourlyValueImportDTO(),
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
});
