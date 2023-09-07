import { IsNumber, IsOptional, IsString } from 'class-validator';

export class HourlyGasFlowMeterBaseDTO {
  @IsString()
  componentId: string;

  @IsOptional()
  @IsString()
  beginEndHourFlag?: string;

  @IsOptional()
  @IsNumber()
  hourlyGFMReading?: number;

  @IsOptional()
  @IsNumber()
  averageHourlySamplingRate?: number;

  @IsOptional()
  @IsString()
  samplingRateUnitsOfMeasureCode?: string;

  @IsOptional()
  @IsNumber()
  hourlySFSRRatio?: number;
}

export class HourlyGasFlowMeterRecordDTO extends HourlyGasFlowMeterBaseDTO {
  id: string;
  hourId: string;
  componentRecordId: string;
  monitoringLocationId: string;
  reportingPeriodId: number;
  calcFlowToSamplingRatio?: number;
  calcFlowToSamplingMult?: number;
  userId?: string;
  addDate?: string;
  updateDate?: string;
}

export class HourlyGasFlowMeterImportDTO extends HourlyGasFlowMeterBaseDTO {}

export class HourlyGasFlowMeterDTO extends HourlyGasFlowMeterRecordDTO {}
