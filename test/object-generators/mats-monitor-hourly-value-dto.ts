import { MatsMonitorHourlyValueImportDTO } from '../../src/dto/mats-monitor-hourly-value.dto';
import { optionalValue } from './util';
import { faker } from '@faker-js/faker';

export const genMatsMonitorHourlyValueImportDto = (
  amount = 1,
): MatsMonitorHourlyValueImportDTO[] => {
  const dtos: MatsMonitorHourlyValueImportDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      parameterCode: faker.string.sample(),
      unadjustedHourlyValue: optionalValue(faker.string.sample()),
      modcCode: optionalValue(faker.string.sample()),
      monitoringSystemId: optionalValue(faker.string.sample()),
      componentId: optionalValue(faker.string.sample()),
      percentAvailable: optionalValue(faker.number.int()),
    });
  }

  return dtos;
};
