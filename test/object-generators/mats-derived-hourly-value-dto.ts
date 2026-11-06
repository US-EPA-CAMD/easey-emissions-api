import { MatsDerivedHourlyValueImportDTO } from '../../src/dto/mats-derived-hourly-value.dto';
import { optionalValue } from './util';
import { faker } from '@faker-js/faker';

export const genMatsDerivedHourlyValueImportDto = (amount = 1) => {
  const dtos: MatsDerivedHourlyValueImportDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      parameterCode: faker.helpers.arrayElement([
        'AKSF',
        'CO2',
        'CO2X',
        'GHR',
        'MHHI',
      ]),
      unadjustedHourlyValue: optionalValue(faker.string.sample()),
      modcCode: optionalValue(
        faker.number.int({ min: 10, max: 46 }).toString(),
      ),
      formulaId: optionalValue(faker.string.sample()),
    });
  }

  return dtos;
};
