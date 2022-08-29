import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import {
  MonitorHourlyValueImportDTO,
  MonitorHourlyValueDTO,
} from './monitor-hourly-value.dto';
import {
  MatsMonitorHourlyValueDTO,
  MatsMonitorHourlyValueImportDTO,
} from './mats-monitor-hourly-value.dto';
import {
  DerivedHourlyValueDTO,
  DerivedHourlyValueImportDTO,
} from './derived-hourly-value.dto';
import {
  HourlyFuelFlowDTO,
  HourlyFuelFlowImportDTO,
} from './hourly-fuel-flow.dto';
import {
  HourlyGasFlowMeterDTO,
  HourlyGasFlowMeterImportDTO,
} from './hourly-gas-flow-meter.dto';
import {
  MatsDerivedHourlyValueDTO,
  MatsDerivedHourlyValueImportDTO,
} from './mats-derived-hourly-value.dto';

export class HourlyOperatingBaseDTO {
  stackPipeId?: string;
  unitId?: string;
  date: Date;
  hour: number;
  operatingTime?: number;
  hourLoad?: number;
  loadUnitsOfMeasureCode?: string;
  matsHourLoad?: number;
  loadRange?: number;
  commonStackLoadRange?: number;
  fcFactor?: number;
  fdFactor?: number;
  fwFactor?: number;
  fuelCode?: string;
  matsStartupShutdownFlag?: string;
}
export class HourlyOperatingRecordDTO extends HourlyOperatingBaseDTO {
  id: string;
  reportingPeriodId: number;
  monitoringLocationId: string;
  multiFuelFlg?: string;
  userId?: string;
  addDate?: Date;
  updateDate?: Date;
  operatingConditionCode?: string;
  fuelCdList?: string;
  mhhiIndicator?: number;
}

export class HourlyOperatingImportDTO extends HourlyOperatingBaseDTO {
  @ValidateNested({ each: true })
  @Type(() => MonitorHourlyValueImportDTO)
  monitorHourlyValueData: MonitorHourlyValueImportDTO[];

  @ValidateNested({ each: true })
  @Type(() => MatsMonitorHourlyValueImportDTO)
  matsMonitorHourlyValueData: MatsMonitorHourlyValueImportDTO[];

  @ValidateNested({ each: true })
  @Type(() => DerivedHourlyValueImportDTO)
  derivedHourlyValueData: DerivedHourlyValueImportDTO[];

  @ValidateNested({ each: true })
  @Type(() => MatsDerivedHourlyValueImportDTO)
  matsDerivedHourlyValueData: MatsDerivedHourlyValueImportDTO[];

  @ValidateNested({ each: true })
  @Type(() => HourlyFuelFlowImportDTO)
  hourlyFuelFlowData: HourlyFuelFlowImportDTO[];

  @ValidateNested({ each: true })
  @Type(() => HourlyGasFlowMeterImportDTO)
  hourlyGFMData: HourlyGasFlowMeterImportDTO[];
}

export class HourlyOperatingDTO extends HourlyOperatingRecordDTO {
  @ValidateNested({ each: true })
  @Type(() => MonitorHourlyValueDTO)
  monitorHourlyValue: MonitorHourlyValueDTO[];

  @ValidateNested({ each: true })
  @Type(() => MatsMonitorHourlyValueDTO)
  matsMonitorHourlyValue: MatsMonitorHourlyValueDTO[];

  @ValidateNested({ each: true })
  @Type(() => DerivedHourlyValueDTO)
  derivedHourlyValue: DerivedHourlyValueDTO[];

  @ValidateNested({ each: true })
  @Type(() => MatsDerivedHourlyValueDTO)
  matsDerivedHourlyValue: MatsDerivedHourlyValueDTO[];

  @ValidateNested({ each: true })
  @Type(() => HourlyFuelFlowDTO)
  hourlyFuelFlow: HourlyFuelFlowDTO[];

  @ValidateNested({ each: true })
  @Type(() => HourlyGasFlowMeterDTO)
  hourlyGasFlowMeter: HourlyGasFlowMeterDTO[];
}
