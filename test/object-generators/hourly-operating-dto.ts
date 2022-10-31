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
import { HourlyOperatingParamsDto } from '../../src/dto/hourly-operating.params.dto';

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
      stackPipeId: optionalValue(faker.datatype.string()),
      unitId: optionalValue(faker.datatype.string()),
      date: faker.datatype.datetime(),
      hour: faker.datatype.number(),
      operatingTime: optionalValue(faker.datatype.number()),
      hourLoad: optionalValue(faker.datatype.number()),
      loadUnitsOfMeasureCode: optionalValue(faker.datatype.string()),
      matsHourLoad: optionalValue(faker.datatype.number()),
      loadRange: optionalValue(faker.datatype.number()),
      commonStackLoadRange: optionalValue(faker.datatype.number()),
      fcFactor: optionalValue(faker.datatype.number()),
      fdFactor: optionalValue(faker.datatype.number()),
      fwFactor: optionalValue(faker.datatype.number()),
      fuelCode: optionalValue(faker.datatype.string()),
      matsStartupShutdownFlag: optionalValue(faker.datatype.string()),
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

export const genHourlyOperatingParamsDto = (
  amount = 1,
): HourlyOperatingParamsDto[] => {
  const dtos: HourlyOperatingParamsDto[] = [];

  const orisCode = () => {
    return faker.datatype.string(6);
  };

  for (let i = 0; i < amount; i++) {
    dtos.push({
      beginDate: (faker.date.soon().toISOString() as unknown) as Date,
      endDate: (faker.date.soon().toISOString() as unknown) as Date,
      locationName: faker.helpers.uniqueArray(faker.datatype.string, 3),
      orisCode: (faker.helpers.uniqueArray(orisCode, 3) as unknown) as number[],
    });
  }

  return dtos;
};
