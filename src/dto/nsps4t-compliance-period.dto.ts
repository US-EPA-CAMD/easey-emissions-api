import { ErrorMessages } from '@us-epa-camd/easey-common/constants';
import { IsInRange } from '@us-epa-camd/easey-common/pipes';
import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class Nsps4tCompliancePeriodBaseDTO {
  @IsOptional()
  @IsNumber()
  @IsInRange(2000, 2099)
  beginYear?: number;

  @IsOptional()
  @IsInt()
  @IsInRange(1, 12)
  beginMonth?: number;

  @IsOptional()
  @IsNumber()
  @IsInRange(2000, 2099)
  endYear?: number;

  @IsOptional()
  @IsNumber()
  @IsInRange(1, 12)
  endMonth?: number;

  @IsOptional()
  @IsNumber()
  @IsInRange(0, 99999)
  averageCO2EmissionRate?: number;

  @IsOptional()
  @IsString()
  // @IsValidCode(UnitsOfMeasureCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  co2EmissionRateUnitsOfMeasureCode?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 }, { message: ErrorMessages.MaxDecimalPlaces})
  @IsInRange(0.0, 100.0)
  percentValidOpHours?: number;

  @IsOptional()
  @IsInt()
  @IsIn([0, 1])
  violationOfCO2StandardIndicator?: number;

  @IsOptional()
  @IsString()
  @MaxLength(3500)
  violationOfCO2StandardComment?: string;
}

export class Nsps4tCompliancePeriodRecordDTO extends Nsps4tCompliancePeriodBaseDTO {
  id: string;
  nsps4tSumId: string;
  monitoringLocationId: string;
  reportingPeriodId: number;
  userId: string;
  addDate?: string;
  updateDate?: string;
}

export class Nsps4tCompliancePeriodImportDTO extends Nsps4tCompliancePeriodBaseDTO {}

export class Nsps4tCompliancePeriodDTO extends Nsps4tCompliancePeriodRecordDTO {}
