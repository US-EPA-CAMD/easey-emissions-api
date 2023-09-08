import { DerivedHourlyValueImportDTO } from '../../src/dto/derived-hourly-value.dto';
import { faker } from '@faker-js/faker';

export const genDerivedHourlyValueImportDto = (amount = 1) => {
  const dtos: DerivedHourlyValueImportDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      parameterCode: faker.datatype.string(),
      unadjustedHourlyValue: faker.datatype.number(),
      adjustedHourlyValue: faker.datatype.number(),
      modcCode: faker.datatype.string(),
      monitoringSystemId: faker.datatype.string(),
      formulaId: faker.datatype.string(),
      percentAvailable: faker.datatype.number(),
      operatingConditionCode: faker.datatype.string(),
      segmentNumber: faker.datatype.number(),
      fuelCode: faker.datatype.string(),
    });
  }

  return dtos;
};
