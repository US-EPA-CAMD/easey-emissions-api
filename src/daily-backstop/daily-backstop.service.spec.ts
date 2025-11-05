import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { DataSource, EntityManager } from 'typeorm';

import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { DailyBackstop } from '../entities/daily-backstop.entity';
import { DailyBackstopMap } from '../maps/daily-backstop.map';
import { DailyBackstopRepository } from './daily-backstop.repository';
import { DailyBackstopService } from './daily-backstop.service';

import mock = jest.mock;

describe('Daily Backstop Service Test', () => {
  let service: DailyBackstopService;
  let repo: DailyBackstopRepository;
  let map: DailyBackstopMap;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DailyBackstopService,
        DailyBackstopRepository,
        DailyBackstopMap,
        EntityManager,
        ConfigService,
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
            }),
          },
        }
      ],
    }).compile();

    service = module.get(DailyBackstopService);
    repo = module.get(DailyBackstopRepository);
    map = module.get(DailyBackstopMap);
  });

  describe('Test Daily Backstop Export', () => {
    it('Should successfully export a Daily Backstop record', async () => {
      const mockQueryBuilder: any = {
        innerJoinAndSelect: () => mockQueryBuilder,
        leftJoinAndSelect: () => mockQueryBuilder,
        innerJoin: () => mockQueryBuilder,
        where: () => mockQueryBuilder,
        andWhere: () => mockQueryBuilder,
        orderBy: () => mockQueryBuilder,
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
});
