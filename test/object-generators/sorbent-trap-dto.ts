import { SorbentTrapImportDTO } from '../../src/dto/sorbent-trap.dto';
import { optionalValue } from './util';
import { faker } from '@faker-js/faker';
import { genSamplingTrainImportDto } from './sampling-train-dto';

type SorbentTrapImportDtoConfig = {
  include?: Array<'samplingTrainData'>;
  samplingTrainDataAmount?: number;
};

export const genSorbentTrapImportDto = (
  amount = 1,
  config?: SorbentTrapImportDtoConfig,
) => {
  const dtos: SorbentTrapImportDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      stackPipeId: optionalValue(faker.string.sample()),
      unitId: optionalValue(faker.string.sample()),
      beginDate: faker.date.soon(),
      beginHour: faker.number.int(),
      endDate: faker.date.soon(),
      endHour: faker.number.int(),
      monitoringSystemId: faker.string.sample(),
      pairedTrapAgreement: faker.number.int(),
      absoluteDifferenceIndicator: faker.number.int(),
      modcCode: optionalValue(faker.string.sample()),
      hgSystemConcentration: optionalValue(faker.string.sample()),
      apsCode: optionalValue(faker.string.sample()),
      rataIndicator: faker.number.int(),
      samplingTrainData: config?.include.includes('samplingTrainData')
        ? genSamplingTrainImportDto(config?.samplingTrainDataAmount)
        : undefined,
    });
  }

  return dtos;
};
