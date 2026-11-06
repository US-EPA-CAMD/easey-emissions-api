import { HourlyOperatingImportDTO } from '../../src/dto/hourly-operating.dto';
import { optionalValue } from './util';
import { faker } from '@faker-js/faker';
import { MonitorHourlyValueImportDTO } from '../../src/dto/monitor-hourly-value.dto';
import { HourlyGasFlowMeterImportDTO } from '../../src/dto/hourly-gas-flow-meter.dto';
import { genDerivedHourlyValueImportDto } from './derived-hourly-value-dto';
import { genMatsDerivedHourlyValueImportDto } from './mats-derived-hourly-value-dto';
import {
  genHourlyFuelFlowImportDto,
  GenHourlyFuelFlowImportDtoConfig,
} from './hourly-fuel-flow-dto';
import { genMatsMonitorHourlyValueImportDto } from './mats-monitor-hourly-value-dto';

export type HourlyOperatingImportDtoConfig = {
  include?: Array<
    | 'monitorHourlyValueData'
    | 'matsMonitorHourlyValueData'
    | 'derivedHourlyValueData'
    | 'matsDerivedHourlyValueData'
    | 'hourlyFuelFlowData'
    | 'hourlyGFMData'
  >;
  derivedHourlyValueAmount?: number;
  hourlyFuelFlowAmount?: number;
  hourlyFuelFlowConfig?: GenHourlyFuelFlowImportDtoConfig;
  matsDerivedHourlyValueAmount?: number;
  matsMonitorHourlyValueAmount?: number;
};

export const genHourlyOperatingImportDto = (
  amount = 1,
  config?: HourlyOperatingImportDtoConfig,
): HourlyOperatingImportDTO[] => {
  const dtos: HourlyOperatingImportDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      stackPipeId: optionalValue(faker.string.sample()),
      unitId: optionalValue(faker.string.sample()),
      date: faker.date.anytime(),
      hour: faker.number.int(),
      operatingTime: optionalValue(faker.number.int()),
      hourLoad: optionalValue(faker.number.int()),
      loadUnitsOfMeasureCode: faker.string.sample(),
      matsHourLoad: optionalValue(faker.number.int()),
      loadRange: optionalValue(faker.number.int()),
      commonStackLoadRange: optionalValue(faker.number.int()),
      fcFactor: optionalValue(faker.number.int()),
      fdFactor: optionalValue(faker.number.int()),
      fwFactor: optionalValue(faker.number.int()),
      fuelCode: faker.string.sample(),
      matsStartupShutdownFlag: optionalValue(faker.string.sample()),
      monitorHourlyValueData: config?.include?.includes(
        'monitorHourlyValueData',
      )
        ? [new MonitorHourlyValueImportDTO()]
        : undefined,
      matsMonitorHourlyValueData: config?.include?.includes(
        'matsMonitorHourlyValueData',
      )
        ? genMatsMonitorHourlyValueImportDto(
            config?.matsMonitorHourlyValueAmount,
          )
        : undefined,
      derivedHourlyValueData: config?.include?.includes(
        'derivedHourlyValueData',
      )
        ? genDerivedHourlyValueImportDto(config?.derivedHourlyValueAmount)
        : undefined,
      matsDerivedHourlyValueData: config?.include?.includes(
        'matsDerivedHourlyValueData',
      )
        ? genMatsDerivedHourlyValueImportDto(
            config?.matsDerivedHourlyValueAmount,
          )
        : undefined,
      hourlyFuelFlowData: config?.include?.includes('hourlyFuelFlowData')
        ? genHourlyFuelFlowImportDto(
            config?.hourlyFuelFlowAmount,
            config?.hourlyFuelFlowConfig,
          )
        : undefined,
      hourlyGFMData: config?.include?.includes('hourlyGFMData')
        ? [new HourlyGasFlowMeterImportDTO()]
        : undefined,
    });
  }

  return dtos;
};
