import { Nsps4tCompliancePeriodImportDTO } from '../../src/dto/nsps4t-compliance-period.dto';
import { faker } from '@faker-js/faker';
import { optionalValue } from './util';

export const genNsps4tCompliancePeriodImportDTO = (
  amount = 1,
): Nsps4tCompliancePeriodImportDTO[] => {
  const dtos: Nsps4tCompliancePeriodImportDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      beginYear: optionalValue(faker.number.int()),
      beginMonth: optionalValue(faker.number.int()),
      endYear: optionalValue(faker.number.int()),
      endMonth: optionalValue(faker.number.int()),
      averageCO2EmissionRate: optionalValue(faker.number.int()),
      co2EmissionRateUnitsOfMeasureCode: optionalValue(faker.string.sample()),
      percentValidOpHours: optionalValue(faker.number.int()),
      violationOfCO2StandardIndicator: optionalValue(faker.number.int()),
      violationOfCO2StandardComment: optionalValue(faker.string.sample()),
    });
  }

  return dtos;
};
