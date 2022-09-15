import { HourlyFuelFlowImportDTO } from '../../src/dto/hourly-fuel-flow.dto';
import { optionalValue } from './util';
import { faker } from '@faker-js/faker';
import { genHourlyParamFuelFlowImportDto } from './hourly-param-fuel-flow-dto';

export type GenHourlyFuelFlowImportDtoConfig = {
  include?: Array<'hourlyParameterFuelFlowData'>;
  hourlyParamFuelFlowAmount?: number;
};

export const genHourlyFuelFlowImportDto = (
  amount = 1,
  config?: GenHourlyFuelFlowImportDtoConfig,
) => {
  const dtos: HourlyFuelFlowImportDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      fuelCode: faker.datatype.string(),
      fuelUsageTime: optionalValue(faker.datatype.number()),
      volumetricFlowRate: optionalValue(faker.datatype.number()),
      volumetricUnitsOfMeasureCode: optionalValue(faker.datatype.string()),
      sourceOfDataVolumetricCode: optionalValue(faker.datatype.string()),
      massFlowRate: optionalValue(faker.datatype.number()),
      sourceOfDataMassCode: optionalValue(faker.datatype.string()),
      monitoringSystemId: optionalValue(faker.datatype.string()),
      hourlyParameterFuelFlowData: config?.include.includes(
        'hourlyParameterFuelFlowData',
      )
        ? genHourlyParamFuelFlowImportDto(config?.hourlyParamFuelFlowAmount)
        : undefined,
    });
  }

  return dtos;
};
