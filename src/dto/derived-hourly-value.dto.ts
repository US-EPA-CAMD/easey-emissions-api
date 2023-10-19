import {
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { COMPONENT_MONITOR_SYS_REGEX, FORMULA_ID_REGEX } from '../constants/regex-list';
import { IsInRange } from '@us-epa-camd/easey-common/pipes';
import { ErrorMessages } from '@us-epa-camd/easey-common/constants';

export class DerivedHourlyValueBaseDTO {
  @IsString()
  // @IsValidCode(ParameterCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  parameterCode: string;

  @IsNumber({ maxDecimalPlaces: 4 }, { message: ErrorMessages.MaxDecimalPlaces })
  @IsOptional()
  @IsInRange(-9999999999.9999, 9999999999.9999)
  unadjustedHourlyValue: number;

  @IsNumber({ maxDecimalPlaces: 4 }, { message: ErrorMessages.MaxDecimalPlaces })
  @IsOptional()
  @IsInRange(-9999999999.9999, 9999999999.9999)
  adjustedHourlyValue: number;

  @IsString()
  @IsOptional()
  // @IsValidCode(ModcCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  modcCode: string;

  @IsString()
  @IsOptional()
  @Matches(COMPONENT_MONITOR_SYS_REGEX)
  monitoringSystemId: string;

  @IsString()
  @IsOptional()
  @Matches(FORMULA_ID_REGEX)
  formulaId: string;

  @IsNumber({ maxDecimalPlaces: 1 }, { message: ErrorMessages.MaxDecimalPlaces })
  @IsOptional()
  @IsInRange(-999.9, 999.9)
  percentAvailable: number;

  @IsString()
  @IsOptional()
  // @IsValidCode(OperatingConditionCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  operatingConditionCode: string;

  @IsNumber()
  @IsOptional()
  segmentNumber: number;

  @IsString()
  @IsOptional()
  // @IsValidCode(FuelCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  fuelCode: string;
}

export class DerivedHourlyValueRecordDTO extends DerivedHourlyValueBaseDTO {
  id: string;
  hourId: string;
  monitoringSystemRecordId: string;
  monitoringFormulaRecordId: string;
  biasAdjustmentFactor: number;
  calcUnadjustedHrlyValue: number;
  calcAdjustedHrlyValue: number;
  diluentCapInd: number;
  userId: string;
  addDate?: string;
  updateDate?: string;
  calcPctDiluent: string;
  calcPctMoisture: string;
  calcRataStatus: string;
  calcAppeStatus: string;
  reportingPeriodId: number;
  monitoringLocationId: string;
  calcFuelFlowTotal: number;
  calcHourMeasureCode: string;
}

export class DerivedHourlyValueImportDTO extends DerivedHourlyValueBaseDTO {}

export class DerivedHourlyValueDTO extends DerivedHourlyValueRecordDTO {}
