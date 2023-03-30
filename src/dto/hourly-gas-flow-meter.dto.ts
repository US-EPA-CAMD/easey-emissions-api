import { IsNumber, IsOptional, IsString } from 'class-validator';

export class HourlyGasFlowMeterBaseDTO {
  @IsString()
  componentId: string;

  @IsOptional()
  @IsString()
  beginEndHourFlag?: string;

  @IsOptional()
  @IsNumber()
  hourlyGfmReading?: number;

  @IsOptional()
  @IsNumber()
  avgHourlySamplingRate?: number;

  @IsOptional()
  @IsString()
  samplingRateUom?: string;

  @IsOptional()
  @IsNumber()
  hourlySfsrRatio?: number;
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
  addDate?: Date;
  updateDate?: Date;
}

export class HourlyGasFlowMeterImportDTO extends HourlyGasFlowMeterBaseDTO {}

export class HourlyGasFlowMeterDTO extends HourlyGasFlowMeterRecordDTO {}
