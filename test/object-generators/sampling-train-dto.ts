import { SamplingTrainImportDTO } from '../../src/dto/sampling-train.dto';
import { optionalValue } from './util';
import { faker } from '@faker-js/faker';

export const genSamplingTrainImportDto = (amount = 1) => {
  const dtos: SamplingTrainImportDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      componentId: faker.datatype.string(),
      sorbentTrapSN: faker.datatype.string(),
      mainTrapHg: optionalValue(faker.datatype.string()),
      btTrapHg: optionalValue(faker.datatype.string()),
      spikeTrapHg: optionalValue(faker.datatype.string()),
      spikeReferenceValue: optionalValue(faker.datatype.string()),
      totalSampleVolumeDSCM: optionalValue(faker.datatype.number()),
      referenceSFSRRatio: optionalValue(faker.datatype.number()),
      hgConcentration: optionalValue(faker.datatype.string()),
      percentBreakthrough: optionalValue(faker.datatype.number()),
      percentSpikeRecovery: optionalValue(faker.datatype.number()),
      samplingRatioCheckResultCode: optionalValue(faker.datatype.string()),
      postLeakCheckResultCode: optionalValue(faker.datatype.string()),
      trainQAStatusCode: optionalValue(faker.datatype.string()),
      sampleDamageExplanation: optionalValue(faker.datatype.string()),
    });
  }

  return dtos;
};
