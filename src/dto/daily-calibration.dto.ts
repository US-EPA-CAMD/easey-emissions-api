import { IsValidCode } from '@us-epa-camd/easey-common/pipes';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidationArguments,
} from 'class-validator';
import { GasLevelCode } from '../entities/gas-level-code.entity';
import { InjectionProtocolCode } from '../entities/injection-protocol-codes.entity';
import { ImportCodeErrorMessage } from '../utils/validator.const';

export class DailyCalibrationBaseDTO {
  @IsOptional()
  @IsNumber()
  onlineOfflineIndicator?: number;

  @IsOptional()
  @IsString()
  @IsValidCode(GasLevelCode, {
    message: (args: ValidationArguments) => {
      return ImportCodeErrorMessage(args.property, args.value);
    },
  })
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
  //add validation
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
  @IsValidCode(InjectionProtocolCode, {
    message: (args: ValidationArguments) => {
      return ImportCodeErrorMessage(args.property, args.value);
    },
  })
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
  addDate?: string;
  updateDate?: string;
  reportingPeriodId?: number;
}

export class DailyCalibrationImportDTO extends DailyCalibrationBaseDTO {}

export class DailyCalibrationDTO extends DailyCalibrationRecordDTO {}
