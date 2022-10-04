import { SamplingTrainRepository } from '../sampling-train/sampling-train.repository';
import { genSamplingTrain } from '../../test/object-generators/sampling-train';
import { SamplingTrain } from '../entities/sampling-train.entity';
import { SamplingTrainMap } from '../maps/sampling-train.map';
import { faker } from '@faker-js/faker';

describe('ExportSamplingTrainData', () => {
  let samplingTrainRepository;
  let exportSamplingTrainModule: typeof import('./export-sampling-train-data');

  beforeAll(async () => {
    samplingTrainRepository = new SamplingTrainRepository();
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
