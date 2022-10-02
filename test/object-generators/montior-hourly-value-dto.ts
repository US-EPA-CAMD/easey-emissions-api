import { optionalValue } from './util';
import { faker } from '@faker-js/faker';
import { MonitorHourlyValueImportDTO } from 'src/dto/monitor-hourly-value.dto';

export const genMonitorHourlyValueImportDto = (
  amount = 1,
): MonitorHourlyValueImportDTO[] => {
  const dtos: MonitorHourlyValueImportDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      parameterCode: faker.datatype.string(),
      unadjustedHourlyValue: optionalValue(faker.datatype.number()),
      adjustedHourlyValue: optionalValue(faker.datatype.number()),
      modcCode: optionalValue(faker.datatype.string()),
      monitoringSystemId: optionalValue(faker.datatype.string()),
      componentId: optionalValue(faker.datatype.string()),
      percentAvailable: optionalValue(faker.datatype.number()),
      moistureBasis: optionalValue(faker.datatype.string()),
    });
  }

  return dtos;
};
