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
      fuelCode: faker.string.sample(),
      fuelUsageTime: optionalValue(faker.number.int()),
      volumetricFlowRate: optionalValue(faker.number.int()),
      volumetricUnitsOfMeasureCode: optionalValue(faker.string.sample()),
      sourceOfDataVolumetricCode: optionalValue(faker.string.sample()),
      massFlowRate: optionalValue(faker.number.int()),
      sourceOfDataMassCode: optionalValue(faker.string.sample()),
      monitoringSystemId: optionalValue(faker.string.sample()),
      hourlyParameterFuelFlowData: config?.include.includes(
        'hourlyParameterFuelFlowData',
      )
        ? genHourlyParamFuelFlowImportDto(config?.hourlyParamFuelFlowAmount)
        : undefined,
    });
  }

  return dtos;
};
