import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { EntityManager, QueryRunner } from 'typeorm';

import { genSamplingTrain } from '../../test/object-generators/sampling-train';
import { ComponentRepository } from '../component/component.repository';
import { SamplingTrainMap } from '../maps/sampling-train.map';
import { SamplingTrainWorkspaceRepository } from './sampling-train-workspace.repository';
import { SamplingTrainWorkspaceService } from './sampling-train-workspace.service';

describe('SamplingTrainWorkspaceService', () => {
  let service: SamplingTrainWorkspaceService;
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
        ComponentRepository,
        SamplingTrainWorkspaceService,
        SamplingTrainWorkspaceRepository,
        BulkLoadService,
        ConfigService,
        SamplingTrainMap,
      ],
    }).compile();

    service = module.get<SamplingTrainWorkspaceService>(
      SamplingTrainWorkspaceService,
    );
    map = module.get(SamplingTrainMap);
    bulkLoadService = module.get(BulkLoadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should successfully import', async () => {
    const samplingTrain = genSamplingTrain<SamplingTrainMap>(1);

    jest.spyOn(bulkLoadService, 'startBulkLoader').mockImplementation(
        (_tableLocation: string, _columns?: string[], _delimiter?: string, _queryRunner?: QueryRunner) => {
          return Promise.resolve({
            writeObject: jest.fn(),
            complete: jest.fn(),
            finished: Promise.resolve(true),
            status: 'Complete',
            resolver: jest.fn(),
            client: jest.fn(),
            delimiter: ',',
            hasWritten: false,
            tableLocation: _tableLocation,
            columns: _columns || []
          } as any);
        }
    );

    await expect(service.import(samplingTrain)).resolves;
  });
});
