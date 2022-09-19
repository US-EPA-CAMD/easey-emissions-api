import { MatsDerivedHourlyValueImportDTO } from '../../src/dto/mats-derived-hourly-value.dto';
import { optionalValue } from './util';
import { faker } from '@faker-js/faker';

export const genMatsDerivedHourlyValueImportDto = (amount = 1) => {
  const dtos: MatsDerivedHourlyValueImportDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      parameterCode: faker.datatype.string(),
      unadjustedHourlyValue: optionalValue(faker.datatype.string()),
      modcCode: optionalValue(faker.datatype.string()),
      formulaIdentifier: optionalValue(faker.datatype.string()),
    });
  }

  return dtos;
};
