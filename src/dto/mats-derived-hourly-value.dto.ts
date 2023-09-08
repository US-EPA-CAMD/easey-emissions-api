import { IsValidCode } from '@us-epa-camd/easey-common/pipes';
import { IsOptional, IsString, Matches, ValidationArguments } from 'class-validator';
import { ParameterCode } from '../entities/parameter-code.entity';
import { ImportCodeErrorMessage } from '../utils/validator.const';
import { ModcCode } from '../entities/modc-code.entity';
import { FORMULA_ID_REGEX, SCIENTIFIC_NOTATION_REGEX } from '../constants/regex-list';

export class MatsDerivedHourlyValueBaseDTO {
  @IsString()
  @IsValidCode(ParameterCode, {
    message: (args: ValidationArguments) => {
      return ImportCodeErrorMessage(args.property, args.value);
    },
  })
  parameterCode: string;

  @IsOptional()
  @IsString()
  @Matches(SCIENTIFIC_NOTATION_REGEX)
  unadjustedHourlyValue?: string;

  @IsOptional()
  @IsString()
  @IsValidCode(ModcCode, {
    message: (args: ValidationArguments) => {
      return ImportCodeErrorMessage(args.property, args.value);
    },
  })
  modcCode?: string;

  @IsOptional()
  @IsString()
  @Matches(FORMULA_ID_REGEX)
  formulaId?: string;
}

export class MatsDerivedHourlyValueRecordDTO extends MatsDerivedHourlyValueBaseDTO {
  id: string;
  hourId: string;
  monitoringFormulaRecordId: string;
  calcUnadjustedHrlyValue?: string;
  calcPctDiluent?: number;
  calcPctMoisture?: number;
  monitoringLocationId: string;
  reportingPeriodId: number;
  userId?: string;
  addDate?: string;
  updateDate?: string;
}

export class MatsDerivedHourlyValueImportDTO extends MatsDerivedHourlyValueBaseDTO {}

export class MatsDerivedHourlyValueDTO extends MatsDerivedHourlyValueRecordDTO {}
