import { HourlyParamFuelFlowImportDTO } from '../../src/dto/hourly-param-fuel-flow.dto';
import { optionalValue } from './util';
import { faker } from '@faker-js/faker';

export const genHourlyParamFuelFlowImportDto = (amount = 1) => {
  const dtos: HourlyParamFuelFlowImportDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      parameterCode: faker.datatype.string(),
      parameterValueForFuel: optionalValue(faker.datatype.number()),
      formulaId: optionalValue(faker.datatype.string()),
      sampleTypeCode: optionalValue(faker.datatype.string()),
      monitoringSystemId: optionalValue(faker.datatype.string()),
      operatingConditionCode: optionalValue(faker.datatype.string()),
      segmentNumber: optionalValue(faker.datatype.number()),
      parameterUomCode: optionalValue(faker.datatype.string()),
    });
  }

  return dtos;
};
