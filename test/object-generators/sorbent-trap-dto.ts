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
      stackPipeId: optionalValue(faker.datatype.string()),
      unitId: optionalValue(faker.datatype.string()),
      beginDate: faker.date.soon(),
      beginHour: faker.datatype.number(),
      endDate: faker.date.soon(),
      endHour: faker.datatype.number(),
      monitoringSystemId: faker.datatype.string(),
      pairedTrapAgreement: faker.datatype.number(),
      absoluteDifferenceIndicator: faker.datatype.number(),
      modcCode: optionalValue(faker.datatype.string()),
      hgSystemConcentration: optionalValue(faker.datatype.string()),
      apsCode: optionalValue(faker.datatype.string()),
      rataIndicator: faker.datatype.number(),
      samplingTrainData: config?.include.includes('samplingTrainData')
        ? genSamplingTrainImportDto(config?.samplingTrainDataAmount)
        : undefined,
    });
  }

  return dtos;
};
