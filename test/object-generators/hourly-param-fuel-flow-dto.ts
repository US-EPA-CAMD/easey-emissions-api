import { HourlyParamFuelFlowImportDTO } from '../../src/dto/hourly-param-fuel-flow.dto';
import { optionalValue } from './util';
import { faker } from '@faker-js/faker';

export const genHourlyParamFuelFlowImportDto = (amount = 1) => {
  const dtos: HourlyParamFuelFlowImportDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      parameterCode: faker.string.sample(),
      parameterValueForFuel: optionalValue(faker.number.int()),
      formulaId: optionalValue(faker.string.sample()),
      sampleTypeCode: optionalValue(faker.string.sample()),
      monitoringSystemId: optionalValue(faker.string.sample()),
      operatingConditionCode: optionalValue(faker.string.sample()),
      segmentNumber: optionalValue(faker.number.int()),
      parameterUnitsOfMeasureCode: optionalValue(faker.string.sample()),
    });
  }

  return dtos;
};
