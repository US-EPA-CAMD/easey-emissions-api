import { ErrorMessages } from '@us-epa-camd/easey-common/constants';
import { IsInRange } from '@us-epa-camd/easey-common/pipes';
import { IsIn, IsNumber, IsString } from 'class-validator';

export class WeeklySystemIntegrityBaseDTO {
  @IsString()
  // @IsValidCode(GasLevelCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  gasLevelCode?: string;

  @IsNumber({ maxDecimalPlaces: 3 }, { message: ErrorMessages.MaxDecimalPlaces})
  @IsInRange(0, 9999999999.999)
  referenceValue?: number;

  @IsNumber({ maxDecimalPlaces: 3 }, { message: ErrorMessages.MaxDecimalPlaces})
  @IsInRange(-9999999999.999, 9999999999.999)
  measuredValue?: number;

  @IsNumber()
  @IsIn([0, 1])
  apsIndicator?: number;

  @IsNumber({ maxDecimalPlaces: 1 }, { message: ErrorMessages.MaxDecimalPlaces})
  @IsInRange(-9999.9, 9999.9)
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
