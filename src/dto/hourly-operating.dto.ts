import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
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
import { STACK_PIPE_ID_REGEX, UNIT_ID_REGEX } from '../constants/regex-list';

export class HourlyOperatingBaseDTO {
  @IsOptional()
  @IsString()
  @Matches(STACK_PIPE_ID_REGEX)
  stackPipeId?: string;

  @IsOptional()
  @IsString()
  @Matches(UNIT_ID_REGEX)
  unitId?: string;

  @IsDateString()
  date: Date;

  @IsNumber()
  @Min(0)
  @Max(23)
  hour: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(9.99)
  operatingTime?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999)
  hourLoad?: number;

  @IsOptional()
  @IsString()
  // @IsValidCode(UnitsOfMeasureCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  loadUnitsOfMeasureCode?: string;

  @IsOptional()
  @IsNumber()
  @Min(-999999)
  @Max(999999)
  matsHourLoad?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(20)
  loadRange?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(20)
  commonStackLoadRange?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(9999999.9)
  fcFactor?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(9999999.9)  
  fdFactor?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(9999999.9)
  fwFactor?: number;

  @IsOptional()
  @IsString()
  // @IsValidCode(FuelCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  fuelCode?: string;

  @IsOptional()
  @IsString()
  @IsIn(['U', 'D'])
  matsStartupShutdownFlag?: string;
}
export class HourlyOperatingRecordDTO extends HourlyOperatingBaseDTO {
  id: string;
  reportingPeriodId: number;
  monitoringLocationId: string;
  multiFuelFlg?: string;
  userId?: string;
  addDate?: string;
  updateDate?: string;
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
