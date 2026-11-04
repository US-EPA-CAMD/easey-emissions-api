import { optionalValue } from './util';
import { faker } from '@faker-js/faker';
import { MonitorHourlyValueImportDTO } from 'src/dto/monitor-hourly-value.dto';

export const genMonitorHourlyValueImportDto = (
  amount = 1,
): MonitorHourlyValueImportDTO[] => {
  const dtos: MonitorHourlyValueImportDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      parameterCode: faker.string.sample(),
      unadjustedHourlyValue: optionalValue(faker.number.int()),
      adjustedHourlyValue: optionalValue(faker.number.int()),
      modcCode: optionalValue(faker.string.sample()),
      monitoringSystemId: optionalValue(faker.string.sample()),
      componentId: optionalValue(faker.string.sample()),
      percentAvailable: optionalValue(faker.number.int()),
      moistureBasis: optionalValue(faker.string.sample()),
    });
  }

  return dtos;
};
