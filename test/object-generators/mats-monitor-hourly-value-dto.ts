import { MatsMonitorHourlyValueImportDTO } from '../../src/dto/mats-monitor-hourly-value.dto';
import { optionalValue } from './util';
import { faker } from '@faker-js/faker';

export const genMatsMonitorHourlyValueImportDto = (
  amount = 1,
): MatsMonitorHourlyValueImportDTO[] => {
  const dtos: MatsMonitorHourlyValueImportDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      parameterCode: faker.datatype.string(),
      unadjustedHourlyValue: optionalValue(faker.datatype.string()),
      modcCode: optionalValue(faker.datatype.string()),
      monitoringSystemId: optionalValue(faker.datatype.string()),
      componentId: optionalValue(faker.datatype.string()),
      percentAvailable: optionalValue(faker.datatype.number()),
    });
  }

  return dtos;
};
