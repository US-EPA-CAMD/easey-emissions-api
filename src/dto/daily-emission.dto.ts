import {
  IsOptional,
  IsString,
  ValidateNested,
  IsNumber,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DailyFuelDTO, DailyFuelImportDTO } from './daily-fuel.dto';
import { STACK_PIPE_ID_REGEX, UNIT_ID_REGEX } from '../constants/regex-list';
import { IsInRange, IsIsoFormat, IsValidDate } from '@us-epa-camd/easey-common/pipes';
import { ErrorMessages } from '@us-epa-camd/easey-common/constants';

export class DailyEmissionBaseDTO {
  @IsOptional()
  @IsString()
  @Matches(STACK_PIPE_ID_REGEX)
  stackPipeId?: string;

  @IsOptional()
  @IsString()
  @Matches(UNIT_ID_REGEX)
  unitId?: string;

  @IsString()
  // @IsValidCode(ParameterCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  parameterCode: string;

  @IsIsoFormat()
  @IsValidDate()
  date: Date;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 }, { message: ErrorMessages.MaxDecimalPlaces })
  @IsInRange(-999999999.9, 999999999.9)
  totalDailyEmissions?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 }, { message: ErrorMessages.MaxDecimalPlaces })
  @IsInRange(-999999999.9, 999999999.9)
  adjustedDailyEmissions?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 }, { message: ErrorMessages.MaxDecimalPlaces })
  @IsInRange(-999999999.9, 999999999.9)
  sorbentRelatedMassEmissions?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 }, { message: ErrorMessages.MaxDecimalPlaces })
  @IsInRange(-999999999.9, 999999999.9)
  unadjustedDailyEmissions?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 }, { message: ErrorMessages.MaxDecimalPlaces })
  @IsInRange(-9999999999999.9, 9999999999999.9)
  totalCarbonBurned?: number;
}

export class DailyEmissionRecordDTO extends DailyEmissionBaseDTO {
  id: string;
  reportingPeriodId: number;
  monitoringLocationId: string;
  userId?: string;
  addDate?: string;
  updateDate?: string;
  calcTotalDailyEmissions?: number;
  calcTotalOpTime?: number;
}

export class DailyEmissionImportDTO extends DailyEmissionBaseDTO {
  @ValidateNested({ each: true })
  @Type(() => DailyFuelImportDTO)
  dailyFuelData: DailyFuelImportDTO[];
}

export class DailyEmissionDTO extends DailyEmissionRecordDTO {
  @ValidateNested({ each: true })
  @Type(() => DailyFuelDTO)
  dailyFuelData: DailyFuelDTO[];
}
