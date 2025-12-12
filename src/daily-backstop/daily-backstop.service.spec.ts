import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { DataSource, EntityManager } from 'typeorm';

import { EmissionsParamsDTO } from '../dto/emissions.params.dto';
import { DailyBackstop } from '../entities/daily-backstop.entity';
import { DailyBackstopMap } from '../maps/daily-backstop.map';
import { DailyBackstopService } from './daily-backstop.service';


const mockRepository = {
  createQueryBuilder: jest.fn(),
};

jest.mock('./daily-backstop.repository', () => ({
  DailyBackstopRepository: jest.fn().mockImplementation(() => mockRepository),
}));

describe('Daily Backstop Service Test', () => {
  let service: DailyBackstopService;
  let map: DailyBackstopMap;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DailyBackstopService,
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
              manager: {
                connection: {},
                queryRunner: {},
              }
            }),
          },
        }
      ],
    }).compile();

    service = module.get(DailyBackstopService);
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

      mockRepository.createQueryBuilder.mockImplementation(() => mockQueryBuilder);

      const results = await service.export(
        ['testSumId1', 'testSumId2'],
        new EmissionsParamsDTO(),
      );

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(results.length).toBe(2);
    });
  });
});
