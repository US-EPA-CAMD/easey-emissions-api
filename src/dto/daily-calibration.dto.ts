import {
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class DailyCalibrationBaseDTO {
  @IsOptional()
  @IsNumber()
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
  @IsDateString()
  zeroInjectionDate?: Date;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(23)
  zeroInjectionHour?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(59)
  zeroInjectionMinute?: number;

  @IsOptional()
  @IsDateString()
  upscaleInjectionDate?: Date;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(23)
  upscaleInjectionHour?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(59)
  upscaleInjectionMinute?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10000000000)
  zeroMeasuredValue?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10000000000)
  upscaleMeasuredValue?: number;

  @IsOptional()
  @IsNumber()
  @IsIn([0, 1])
  zeroAPSIndicator?: number;

  @IsOptional()
  @IsNumber()
  @IsIn([0, 1])
  upscaleAPSIndicator?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(9999.99)
  zeroCalibrationError?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(9999.99)
  upscaleCalibrationError?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10000000000)
  zeroReferenceValue?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10000000000)
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
  @IsDateString()
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
