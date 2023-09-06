import { Nsps4tCompliancePeriodImportDTO } from '../../src/dto/nsps4t-compliance-period.dto';
import { faker } from '@faker-js/faker';
import { optionalValue } from './util';

export const genNsps4tCompliancePeriodImportDTO = (
  amount = 1,
): Nsps4tCompliancePeriodImportDTO[] => {
  const dtos: Nsps4tCompliancePeriodImportDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      beginYear: optionalValue(faker.datatype.number()),
      beginMonth: optionalValue(faker.datatype.number()),
      endYear: optionalValue(faker.datatype.number()),
      endMonth: optionalValue(faker.datatype.number()),
      averageCO2EmissionRate: optionalValue(faker.datatype.number()),
      co2EmissionRateUnitsOfMeasureCode: optionalValue(faker.datatype.string()),
      percentValidOpHours: optionalValue(faker.datatype.number()),
      violationOfCo2StandardIndicator: optionalValue(faker.datatype.number()),
      violationOfCo2StandardComment: optionalValue(faker.datatype.string()),
    });
  }

  return dtos;
};
