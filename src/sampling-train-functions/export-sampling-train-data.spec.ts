import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';

import { genSamplingTrain } from '../../test/object-generators/sampling-train';
import { SamplingTrain } from '../entities/sampling-train.entity';
import { SamplingTrainMap } from '../maps/sampling-train.map';
import { SamplingTrainRepository } from '../sampling-train/sampling-train.repository';

describe('ExportSamplingTrainData', () => {
  let samplingTrainRepository;
  let exportSamplingTrainModule: typeof import('./export-sampling-train-data');

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntityManager, SamplingTrainRepository],
    }).compile();

    samplingTrainRepository = module.get(SamplingTrainRepository);
    exportSamplingTrainModule = await import('./export-sampling-train-data');
  });

  it('should export records', async function() {
    const samplingTrainMocks = genSamplingTrain<SamplingTrain>(3);
    const mappedSamplingTrain = await new SamplingTrainMap().many(
      samplingTrainMocks,
    );

    jest
      .spyOn(exportSamplingTrainModule, 'exportSamplingTrainQuery')
      .mockResolvedValue(samplingTrainMocks);

    await expect(
      exportSamplingTrainModule.exportSamplingTrainData({
        repository: samplingTrainRepository,
        sorbentTrapId: faker.datatype.string(),
      }),
    ).resolves.toEqual(mappedSamplingTrain);
  });
});
