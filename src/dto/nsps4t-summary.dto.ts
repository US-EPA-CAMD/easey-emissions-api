import {
  ArrayMaxSize,
  ArrayMinSize,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  Nsps4tCompliancePeriodDTO,
  Nsps4tCompliancePeriodImportDTO,
} from './nsps4t-compliance-period.dto';
import { Nsps4tAnnualDTO, Nsps4tAnnualImportDTO } from './nsps4t-annual.dto';
import { STACK_PIPE_ID_REGEX, UNIT_ID_REGEX } from '../constants/regex-list';
import { IsInRange } from '@us-epa-camd/easey-common/pipes';

export class Nsps4tSummaryBaseDTO {
  @IsOptional()
  @IsString()
  @Matches(STACK_PIPE_ID_REGEX)
  stackPipeId?: string;

  @IsOptional()
  @IsString()
  @Matches(UNIT_ID_REGEX)
  unitId?: string;

  @IsOptional()
  @IsString()
  // @IsValidCode(Nsps4tEmissionStandardCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  co2EmissionStandardCode?: string;

  @IsOptional()
  @IsNumber()
  @IsInRange(0, 99999)
  modusValue?: number;

  @IsOptional()
  @IsString()
  // @IsValidCode(UnitsOfMeasureCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  modusUnitsOfMeasureCode?: string;

  @IsOptional()
  @IsString()
  // @IsValidCode(Nsps4tElectricalLoadCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  electricalLoadCode?: string;

  @IsOptional()
  @IsInt()
  @IsIn([0, 1])
  noCompliancePeriodEndedIndicator?: number;

  @IsOptional()
  @IsString()
  @MaxLength(3500)
  noCompliancePeriodEndedComment?: string;
}

export class Nsps4tSummaryRecordDTO extends Nsps4tSummaryBaseDTO {
  id: string;
  monitoringLocationId: string;
  reportingPeriodId: number;
  userId: string;
  addDate?: string;
  updateDate?: string;
}

export class Nsps4tSummaryImportDTO extends Nsps4tSummaryBaseDTO {
  @ValidateNested({ each: true })
  @Type(() => Nsps4tCompliancePeriodImportDTO)
  @ArrayMinSize(0)
  @ArrayMaxSize(3)
  nsps4tCompliancePeriodData: Nsps4tCompliancePeriodImportDTO[];

  @ValidateNested({ each: true })
  @Type(() => Nsps4tAnnualImportDTO)
  @ArrayMinSize(0)
  @ArrayMaxSize(1)
  nsps4tFourthQuarterData: Nsps4tAnnualImportDTO[];
}

export class Nsps4tSummaryDTO extends Nsps4tSummaryRecordDTO {
  @ValidateNested({ each: true })
  @Type(() => Nsps4tCompliancePeriodDTO)
  @ArrayMinSize(0)
  @ArrayMaxSize(3)
  nsps4tCompliancePeriodData: Nsps4tCompliancePeriodDTO[];

  @ValidateNested({ each: true })
  @Type(() => Nsps4tAnnualDTO)
  @ArrayMinSize(0)
  @ArrayMaxSize(1)
  nsps4tFourthQuarterData: Nsps4tAnnualDTO[];
}
