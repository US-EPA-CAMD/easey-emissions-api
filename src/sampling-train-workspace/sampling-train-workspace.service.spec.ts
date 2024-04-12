import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { BulkLoadService } from '@us-epa-camd/easey-common/bulk-load';
import { EntityManager } from 'typeorm';

import { genSamplingTrain } from '../../test/object-generators/sampling-train';
import { ComponentRepository } from '../component/component.repository';
import { SamplingTrainMap } from '../maps/sampling-train.map';
import { SamplingTrainWorkspaceRepository } from './sampling-train-workspace.repository';
import { SamplingTrainWorkspaceService } from './sampling-train-workspace.service';

describe('SamplingTrainWorkspaceService', () => {
  let service: SamplingTrainWorkspaceService;
  let map;
  let bulkLoadService: BulkLoadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EntityManager,
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

    //@ts-expect-error as mock
    jest.spyOn(bulkLoadService, 'startBulkLoader').mockResolvedValue({
      writeObject: jest.fn(),
      complete: jest.fn(),
      finished: Promise.resolve(true),
    });

    await expect(service.import(samplingTrain)).resolves;
  });
});
