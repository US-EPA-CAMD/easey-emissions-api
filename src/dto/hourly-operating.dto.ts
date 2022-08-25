import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MonitorHourlyValueDTO } from './monitor-hourly-value.dto';
import { MatsMonitorHrlyValueDTO } from './mats-monitor-hrly-value.dto';
import { DerivedHourlyValueDTO } from './derived-hourly-value.dto';
import { MatsDerivedHrlyValueDTO } from './mats-derived-hrly-value.dto';
import { HourlyFuelFlowDTO } from './hrly-fuel-flow.dto';
import { HrlyGasFlowMeterDTO } from './hrly-gas-flow-meter.dto';

export class HourlyOperatingBaseDTO {
  stackPipeId: string;
  unitId: string;
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
  operatingConditionCd?: string;
  fuelCdList?: string;
  mhhiIndicator?: number;
  matsLoad?: number;
}

export class HourlyOperatingImportDTO extends HourlyOperatingBaseDTO {
  @ValidateNested({ each: true })
  @Type(() => MonitorHourlyValueDTO)
  monitorHourlyValueData: MonitorHourlyValueDTO[];

  @ValidateNested({ each: true })
  @Type(() => MatsMonitorHrlyValueDTO)
  matsMonitorHourlyValueData: MatsMonitorHrlyValueDTO[];

  @ValidateNested({ each: true })
  @Type(() => DerivedHourlyValueDTO)
  derivedHourlyValueData: DerivedHourlyValueDTO[];

  @ValidateNested({ each: true })
  @Type(() => MatsDerivedHrlyValueDTO)
  matsDerivedHourlyValueData: MatsDerivedHrlyValueDTO[];

  @ValidateNested({ each: true })
  @Type(() => HourlyFuelFlowDTO)
  hourlyFuelFlowData: HourlyFuelFlowDTO[];

  @ValidateNested({ each: true })
  @Type(() => HrlyGasFlowMeterDTO)
  hourlyGFMData: HrlyGasFlowMeterDTO[];
}

export class HourlyOperatingDTO extends HourlyOperatingRecordDTO {
  @ValidateNested({ each: true })
  @Type(() => MonitorHourlyValueDTO)
  monitorHourlyValueData: MonitorHourlyValueDTO[];

  @ValidateNested({ each: true })
  @Type(() => MatsMonitorHrlyValueDTO)
  matsMonitorHourlyValueData: MatsMonitorHrlyValueDTO[];

  @ValidateNested({ each: true })
  @Type(() => DerivedHourlyValueDTO)
  derivedHourlyValueData: DerivedHourlyValueDTO[];

  @ValidateNested({ each: true })
  @Type(() => MatsDerivedHrlyValueDTO)
  matsDerivedHourlyValueData: MatsDerivedHrlyValueDTO[];

  @ValidateNested({ each: true })
  @Type(() => HourlyFuelFlowDTO)
  hourlyFuelFlowData: HourlyFuelFlowDTO[];

  @ValidateNested({ each: true })
  @Type(() => HrlyGasFlowMeterDTO)
  hourlyGFMData: HrlyGasFlowMeterDTO[];
}