import { ErrorMessages } from '@us-epa-camd/easey-common/constants';
import { IsInRange, IsIsoFormat, IsValidDate } from '@us-epa-camd/easey-common/pipes';
import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class DailyCalibrationBaseDTO {
  @IsOptional()
  @IsInt()
  @IsIn([0, 1])
  onlineOfflineIndicator?: number;

  @IsOptional()
  @IsString()
  // @IsValidCode(GasLevelCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  upscaleGasCode?: string;

  @IsOptional()
  @IsIsoFormat()
  @IsValidDate()
  zeroInjectionDate?: Date;

  @IsOptional()
  @IsNumber()
  @IsInRange(0, 23)
  zeroInjectionHour?: number;

  @IsOptional()
  @IsInRange(0, 59)
  zeroInjectionMinute?: number;

  @IsOptional()
  @IsIsoFormat()
  @IsValidDate()
  upscaleInjectionDate?: Date;

  @IsOptional()
  @IsNumber()
  @IsInRange(0, 23)
  upscaleInjectionHour?: number;

  @IsOptional()
  @IsNumber()
  @IsInRange(0, 59)
  upscaleInjectionMinute?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 3 }, { message: ErrorMessages.MaxDecimalPlaces })
  @IsInRange(-9999999999.999, 9999999999.999)
  zeroMeasuredValue?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 3 }, { message: ErrorMessages.MaxDecimalPlaces })
  @IsInRange(-9999999999.999, 9999999999.999)
  upscaleMeasuredValue?: number;

  @IsOptional()
  @IsInt()
  @IsIn([0, 1])
  zeroAPSIndicator?: number;

  @IsOptional()
  @IsNumber()
  @IsInt()
  upscaleAPSIndicator?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: ErrorMessages.MaxDecimalPlaces })
  @IsInRange(-9999.99, 9999.99)
  zeroCalibrationError?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: ErrorMessages.MaxDecimalPlaces })
  @IsInRange(-9999.99, 9999.99)
  upscaleCalibrationError?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 3 }, { message: ErrorMessages.MaxDecimalPlaces })
  @IsInRange(-9999999999.999, 9999999999.999)
  zeroReferenceValue?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 3 }, { message: ErrorMessages.MaxDecimalPlaces })
  @IsInRange(-9999999999.999, 9999999999.999)
  upscaleReferenceValue?: number;

  @IsOptional()
  @IsString()
  //add validation
  upscaleGasTypeCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(25)
  cylinderIdentifier?: string;

  @IsOptional()
  @IsString()
  @MaxLength(8)
  // @DbLookup(
  //   ProtocolGasVendor,
  //   (args: ValidationArguments): FindOneOptions<ProtocolGasVendor> => {
  //     return { where: { id: args.value } };
  //   },
  //   {
  //     message: (args: ValidationArguments) => {
  //       return `${args.property} has an invalid value of ${args.value}`;
  //     },
  //   },
  // )
  vendorIdentifier?: string;

  @IsOptional()
  @IsIsoFormat()
  @IsValidDate()
  expirationDate?: Date;

  @IsOptional()
  @IsString()
  // @IsValidCode(InjectionProtocolCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
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
