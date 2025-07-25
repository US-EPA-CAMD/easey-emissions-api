import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { EntityManager, QueryRunner } from 'typeorm';

import { genNsps4tAnnual } from '../../test/object-generators/nsps4t-annual';
import { Nsps4tAnnual } from '../entities/workspace/nsps4t-annual.entity';
import { Nsps4tAnnualMap } from '../maps/nsps4t-annual.map';
import { Nsps4tAnnualWorkspaceRepository } from './nsps4t-annual-workspace.repository';
import { Nsps4tAnnualWorkspaceService } from './nsps4t-annual-workspace.service';

describe('Nsps4tAnnualWorkspaceService', () => {
  let service: Nsps4tAnnualWorkspaceService;
  let map: any;
  let bulkLoadService: BulkLoadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: EntityManager,
          useFactory: () => ({
            createQueryRunner: jest.fn().mockReturnValue({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
              manager: {
                save: jest.fn(),
                find: jest.fn(),
                findOne: jest.fn(),
                remove: jest.fn(),
                query: jest.fn(),
              },
            }),
          }),
        },
        Nsps4tAnnualWorkspaceService,
        Nsps4tAnnualWorkspaceRepository,
        Nsps4tAnnualMap,
        BulkLoadService,
        ConfigService,
      ],
    }).compile();

    service = module.get<Nsps4tAnnualWorkspaceService>(
      Nsps4tAnnualWorkspaceService,
    );
    map = module.get(Nsps4tAnnualMap);
    bulkLoadService = module.get(BulkLoadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should successfully import', async () => {
    const nsps4tAnnual = genNsps4tAnnual<Nsps4tAnnual>(1);

    jest.spyOn(bulkLoadService, 'startBulkLoader').mockImplementation(
        (_tableLocation: string, _columns?: string[], _delimiter?: string, _queryRunner?: QueryRunner) => {
          // @ts-ignore
          return Promise.resolve({
            writeObject: jest.fn(),
            complete: jest.fn(),
            finished: Promise.resolve(true),
            status: 'Complete',
          });
        }
    );

    await expect(service.import(nsps4tAnnual)).resolves;
  });
});
