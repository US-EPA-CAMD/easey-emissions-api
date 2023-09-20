import { IsIn, IsNumber, IsString, Max, Min, ValidationArguments } from 'class-validator';

export class WeeklySystemIntegrityBaseDTO {
  @IsString()
  // @IsValidCode(GasLevelCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  gasLevelCode?: string;

  @IsNumber()
  @Min(0)
  @Max(9999999999.999)
  referenceValue?: number;

  @IsNumber()
  @Min(0)
  @Max(9999999999.999)
  measuredValue?: number;

  @IsNumber()
  @IsIn([0, 1])
  apsIndicator?: number;

  @IsNumber()
  @Min(0)
  @Max(9999.9)
  systemIntegrityError?: number;
}

export class WeeklySystemIntegrityRecordDTO extends WeeklySystemIntegrityBaseDTO {
  id: string;
  weeklyTestSumId: string;
  calcSystemIntegrityError?: number;
  calcApsInd?: number;
  userId?: string;
  addDate?: string;
  updateDate?: string;
  reportingPeriodId: number;
  monitoringLocationId: string;
}

export class WeeklySystemIntegrityImportDTO extends WeeklySystemIntegrityBaseDTO {}

export class WeeklySystemIntegrityDTO extends WeeklySystemIntegrityRecordDTO {}
