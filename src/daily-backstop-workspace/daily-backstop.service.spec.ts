import { faker } from '@faker-js/faker';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { EntityManager, QueryRunner } from 'typeorm';

import { genDailyBackstopImportDto } from '../../test/object-generators/daily-backstop-dto';
import { EmissionsImportDTO } from '../dto/emissions.dto';
import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { DailyBackstop } from '../entities/workspace/daily-backstop.entity';
import { DailyBackstopMap } from '../maps/daily-backstop.map';
import { DailyBackstopWorkspaceRepository } from './daily-backstop.repository';
import { DailyBackstopWorkspaceService } from './daily-backstop.service';

describe('Daily Backstop Workspace Service Test', () => {
  let service: DailyBackstopWorkspaceService;
  let repo: DailyBackstopWorkspaceRepository;
  let map: DailyBackstopMap;
  let bulkLoadService: BulkLoadService;

  const mockEntityManager = {
    transaction: jest.fn().mockImplementation(async (callback) => {
      const mockQueryRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          save: jest.fn(),
          delete: jest.fn(),
          findOne: jest.fn(),
          find: jest.fn(),
        },
      };
      return callback(mockQueryRunner);
    }),
    save: jest.fn(),
    delete: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DailyBackstopWorkspaceService,
        DailyBackstopWorkspaceRepository,
        DailyBackstopMap,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
        EntityManager,
        BulkLoadService,
        ConfigService,
      ],
    }).compile();

    service = module.get(DailyBackstopWorkspaceService);
    repo = module.get(DailyBackstopWorkspaceRepository);
    map = module.get(DailyBackstopMap);
    bulkLoadService = module.get(BulkLoadService);
  });

  describe('Test Daily Backstop Export', () => {
    it('Should successfully export a Daily Backstop record', async () => {
      const mockQueryBuilder: any = {
        innerJoinAndSelect: () => mockQueryBuilder,
        leftJoinAndSelect: () => mockQueryBuilder,
        innerJoin: () => mockQueryBuilder,
        where: () => mockQueryBuilder,
        andWhere: () => mockQueryBuilder,
        getMany: jest
          .fn()
          .mockResolvedValue([new DailyBackstop(), new DailyBackstop()]),
      };

      const mockRepo = jest
        .spyOn(repo, 'createQueryBuilder')
        .mockImplementation(() => mockQueryBuilder);

      const results = await service.export(
        ['testSumId1', 'testSumId2'],
        new EmissionsParamsDTO(),
      );

      expect(mockRepo).toHaveBeenCalledTimes(1);
      expect(results.length).toBe(2);
    });
  });

  describe('Daily Backstop Import', () => {
    it('should successfully import a daily record', async () => {
      const generatedData = genDailyBackstopImportDto(1);

      jest.spyOn(bulkLoadService, 'startBulkLoader').mockImplementation(
          (_tableLocation: string, _columns?: string[], _delimiter?: string) => {
            // @ts-ignore
            return Promise.resolve({
              writeObject: jest.fn(),
              complete: jest.fn(),
              finished: Promise.resolve(true),
              status: 'Complete',
            });
          }
      );

      const emissionsDto = new EmissionsImportDTO();
      emissionsDto.dailyBackstopData = generatedData;

      const locations = [{ unit: { name: 'a' }, id: 1 }];
      emissionsDto.dailyBackstopData[0].unitId = 'a';
      const identifiers = { locations: {}, userId: '' };
      const monitoringLocationId = faker.datatype.string();
      identifiers.locations[monitoringLocationId] = {
        components: {},
        monitorFormulas: {},
        monitoringSystems: {},
      };

      await expect(service.import(emissionsDto, locations, '', identifiers, ''))
        .resolves;
    });
  });
});
