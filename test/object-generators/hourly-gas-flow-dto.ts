import { faker } from '@faker-js/faker';
import { optionalValue } from './util';

export const genHourlyGasFlowDto = (amount = 1) => {
  const dtos = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      componentId: faker.string.sample(),
      beginEndHourFlag: optionalValue(faker.string.sample()),
      hourlyGfmReading: optionalValue(faker.number.int()),
      avgHourlySamplingRate: optionalValue(faker.number.int()),
      samplingRateUom: optionalValue(faker.string.sample()),
      hourlySfsrRatio: optionalValue(faker.number.int()),
      id: faker.string.sample(),
      hourId: faker.string.sample(),
      componentRecordId: faker.string.sample(),
      monitoringLocationId: faker.string.sample(),
      reportingPeriodId: faker.number.int(),
      calcFlowToSamplingRatio: optionalValue(faker.number.int()),
      calcFlowToSamplingMult: optionalValue(faker.number.int()),
      userId: optionalValue(faker.string.sample()),
      addDate: optionalValue(faker.date.soon()),
      updateDate: optionalValue(faker.date.soon()),
    });
  }

  return dtos;
};
