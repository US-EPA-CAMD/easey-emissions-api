import { IsValidCode } from '@us-epa-camd/easey-common/pipes';
import {
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  ValidationArguments,
} from 'class-validator';
import { ParameterCode } from '../entities/parameter-code.entity';
import { ImportCodeErrorMessage } from '../utils/validator.const';
import { ModcCode } from '../entities/modc-code.entity';
import { OperatingConditionCode } from '../entities/operating-condition-code.entity';
import { FuelCode } from '../entities/fuel-code.entity';
import { FORMULA_ID_REGEX } from '../constants/regex-list';

export class DerivedHourlyValueBaseDTO {
  @IsString()
  @IsValidCode(ParameterCode, {
    message: (args: ValidationArguments) => {
      return ImportCodeErrorMessage(args.property, args.value);
    },
  })
  parameterCode: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(9999999999.9999)
  unadjustedHourlyValue: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(9999999999.9999)
  adjustedHourlyValue: number;

  @IsString()
  @IsOptional()
  @IsValidCode(ModcCode, {
    message: (args: ValidationArguments) => {
      return ImportCodeErrorMessage(args.property, args.value);
    },
  })
  modcCode: string;

  @IsString()
  @IsOptional()
  monitoringSystemId: string;

  @IsString()
  @IsOptional()
  @Matches(FORMULA_ID_REGEX)
  formulaId: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.9)
  percentAvailable: number;

  @IsString()
  @IsOptional()
  @IsValidCode(OperatingConditionCode, {
    message: (args: ValidationArguments) => {
      return ImportCodeErrorMessage(args.property, args.value);
    },
  })
  operatingConditionCode: string;

  @IsNumber()
  @IsOptional()
  segmentNumber: number;

  @IsString()
  @IsOptional()
  @IsValidCode(FuelCode, {
    message: (args: ValidationArguments) => {
      return ImportCodeErrorMessage(args.property, args.value);
    },
  })
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
