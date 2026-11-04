import { DerivedHourlyValueImportDTO } from '../../src/dto/derived-hourly-value.dto';
import { faker } from '@faker-js/faker';

export const genDerivedHourlyValueImportDto = (amount = 1) => {
  const dtos: DerivedHourlyValueImportDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      parameterCode: faker.string.sample(),
      unadjustedHourlyValue: faker.number.int(),
      adjustedHourlyValue: faker.number.int(),
      modcCode: faker.string.sample(),
      monitoringSystemId: faker.string.sample(),
      formulaId: faker.string.sample(),
      percentAvailable: faker.number.int(),
      operatingConditionCode: faker.string.sample(),
      segmentNumber: faker.number.int(),
      fuelCode: faker.string.sample(),
    });
  }

  return dtos;
};
