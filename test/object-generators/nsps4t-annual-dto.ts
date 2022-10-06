import { Nsps4tAnnualImportDTO } from '../../src/dto/nsps4t-annual.dto';
import { faker } from '@faker-js/faker';
import { optionalValue } from './util';

export const genNsps4tAnnualImportDto = (
  amount = 1,
): Nsps4tAnnualImportDTO[] => {
  const dtos: Nsps4tAnnualImportDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      annualEnergySold: optionalValue(faker.datatype.number()),
      annualEnergySoldTypeCode: optionalValue(faker.datatype.string()),
      annualPotentialElectricOutput: optionalValue(faker.datatype.number()),
    });
  }

  return dtos;
};
