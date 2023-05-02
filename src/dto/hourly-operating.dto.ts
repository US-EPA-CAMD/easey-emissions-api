import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

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
  @IsOptional()
  @IsString()
  stackPipeId?: string;

  @IsOptional()
  @IsString()
  unitId?: string;

  @IsDateString()
  date: Date;

  @IsNumber()
  hour: number;

  @IsOptional()
  @IsNumber()
  operatingTime?: number;

  @IsOptional()
  @IsNumber()
  hourLoad?: number;

  @IsOptional()
  @IsString()
  loadUnitsOfMeasureCode?: string;

  @IsOptional()
  @IsNumber()
  matsHourLoad?: number;

  @IsOptional()
  @IsNumber()
  loadRange?: number;

  @IsOptional()
  @IsNumber()
  commonStackLoadRange?: number;

  @IsOptional()
  @IsNumber()
  fcFactor?: number;

  @IsOptional()
  @IsNumber()
  fdFactor?: number;

  @IsOptional()
  @IsNumber()
  fwFactor?: number;

  @IsOptional()
  @IsString()
  fuelCode?: string;

  @IsOptional()
  @IsString()
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
  monitorHourlyValueData: MonitorHourlyValueDTO[];

  @ValidateNested({ each: true })
  @Type(() => MatsMonitorHourlyValueDTO)
  matsMonitorHourlyValueData: MatsMonitorHourlyValueDTO[];

  @ValidateNested({ each: true })
  @Type(() => DerivedHourlyValueDTO)
  derivedHourlyValueData: DerivedHourlyValueDTO[];

  @ValidateNested({ each: true })
  @Type(() => MatsDerivedHourlyValueDTO)
  matsDerivedHourlyValueData: MatsDerivedHourlyValueDTO[];

  @ValidateNested({ each: true })
  @Type(() => HourlyFuelFlowDTO)
  hourlyFuelFlowData: HourlyFuelFlowDTO[];

  @ValidateNested({ each: true })
  @Type(() => HourlyGasFlowMeterDTO)
  hourlyGFMData: HourlyGasFlowMeterDTO[];
}
