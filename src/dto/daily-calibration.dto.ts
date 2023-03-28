import { Transform } from "class-transformer";
import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator";
import moment from "moment";

export class DailyCalibrationBaseDTO {
  @IsOptional()
  @IsNumber()
  onLineOffLineIndicator?: number;

  @IsOptional()
  @IsString()
  upscaleGasCode?: string;
  
  @IsOptional()
  @IsDateString()
  zeroInjectionDate?: Date;

  @IsOptional()
  @IsNumber()
  zeroInjectionHour?: number;

  @IsOptional()
  @IsNumber()
  zeroInjectionMinute?: number;

  @IsOptional()
  @IsDateString()
  upscaleInjectionDate?: Date;

  @IsOptional()
  @IsNumber()
  upscaleInjectionHour?: number;

  @IsOptional()
  @IsNumber()
  upscaleInjectionMinute?: number;

  @IsOptional()
  @IsNumber()
  zeroMeasuredValue?: number;

  @IsOptional()
  @IsNumber()
  upscaleMeasuredValue?: number;

  @IsOptional()
  @IsNumber()
  zeroAPSIndicator?: number;

  @IsOptional()
  @IsNumber()
  upscaleAPSIndicator?: number;

  @IsOptional()
  @IsNumber()
  zeroCalibrationError?: number;

  @IsOptional()
  @IsNumber()
  upscaleCalibrationError?: number;

  @IsOptional()
  @IsNumber()
  zeroReferenceValue?: number;

  @IsOptional()
  @IsNumber()
  upscaleReferenceValue?: number;

  @IsOptional()
  @IsString()
  upscaleGasTypeCode?: string;

  @IsOptional()
  @IsString()
  cylinderIdentifier?: string;

  @IsOptional()
  @IsString()
  vendorIdentifier?: string;

  @IsOptional()
  @IsDateString()
  expirationDate?: Date;

  @IsOptional()
  @IsString()
  injectionProtocolCode?: string;
}

export class DailyCalibrationRecordDTO extends DailyCalibrationBaseDTO {
  id: string;

  dailyTestSumId: string;

  calcOnlineOfflineIndicator?: number;

  calcZeroApsIndicator?: number;

  calcUpscaleApsIndicator?: number;

  calcZeroCalibrationError?: number;

  calcUpscaleCalibrationError?: number;

  userId?: string;

  addDate?: Date;

  updateDate?: Date;

  reportingPeriodId?: number;
}

export class DailyCalibrationImportDTO extends DailyCalibrationBaseDTO {}

export class DailyCalibrationDTO extends DailyCalibrationRecordDTO {}
