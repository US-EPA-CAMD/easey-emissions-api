import { faker } from '@faker-js/faker';
import { optionalValue } from './util';

export const genHourlyGasFlowDto = (amount = 1) => {
  const dtos = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      componentId: faker.datatype.string(),
      beginEndHourFlag: optionalValue(faker.datatype.string()),
      hourlyGfmReading: optionalValue(faker.datatype.number()),
      avgHourlySamplingRate: optionalValue(faker.datatype.number()),
      samplingRateUom: optionalValue(faker.datatype.string()),
      hourlySfsrRatio: optionalValue(faker.datatype.number()),
      id: faker.datatype.string(),
      hourId: faker.datatype.string(),
      componentRecordId: faker.datatype.string(),
      monitoringLocationId: faker.datatype.string(),
      reportingPeriodId: faker.datatype.number(),
      calcFlowToSamplingRatio: optionalValue(faker.datatype.number()),
      calcFlowToSamplingMult: optionalValue(faker.datatype.number()),
      userId: optionalValue(faker.datatype.string()),
      addDate: optionalValue(faker.date.soon()),
      updateDate: optionalValue(faker.date.soon()),
    });
  }

  return dtos;
};
