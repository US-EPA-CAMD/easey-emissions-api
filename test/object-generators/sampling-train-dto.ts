import { SamplingTrainImportDTO } from '../../src/dto/sampling-train.dto';
import { optionalValue } from './util';
import { faker } from '@faker-js/faker';

export const genSamplingTrainImportDto = (amount = 1) => {
  const dtos: SamplingTrainImportDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      componentId: faker.string.sample(),
      sorbentTrapSN: faker.string.sample(),
      mainTrapHg: optionalValue(faker.string.sample()),
      btTrapHg: optionalValue(faker.string.sample()),
      spikeTrapHg: optionalValue(faker.string.sample()),
      spikeReferenceValue: optionalValue(faker.string.sample()),
      totalSampleVolumeDSCM: optionalValue(faker.number.int()),
      referenceSFSRRatio: optionalValue(faker.number.int()),
      hgConcentration: optionalValue(faker.string.sample()),
      percentBreakthrough: optionalValue(faker.number.int()),
      percentSpikeRecovery: optionalValue(faker.number.int()),
      samplingRatioCheckResultCode: optionalValue(faker.string.sample()),
      postLeakCheckResultCode: optionalValue(faker.string.sample()),
      trainQAStatusCode: optionalValue(faker.string.sample()),
      sampleDamageExplanation: optionalValue(faker.string.sample()),
    });
  }

  return dtos;
};
