import { IsValidCode } from '@us-epa-camd/easey-common/pipes';
import { IsOptional, IsString } from 'class-validator';
import { ParameterCode } from '../entities/parameter-code.entity';
import { ImportCodeErrorMessage } from '../utils/validator.const';
import { ModcCode } from 'src/entities/modc-code.entity';

export class MatsDerivedHourlyValueBaseDTO {
  @IsString()
  @IsValidCode(ParameterCode, {
    message: ImportCodeErrorMessage(),
  })
  parameterCode: string;

  @IsOptional()
  @IsString()
  unadjustedHourlyValue?: string;

  @IsOptional()
  @IsString()
  @IsValidCode(ModcCode, {
    message: ImportCodeErrorMessage(),
  })
  modcCode?: string;

  @IsOptional()
  @IsString()
  formulaIdentifier?: string;
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
  addDate?: Date;
  updateDate?: Date;
}

export class MatsDerivedHourlyValueImportDTO extends MatsDerivedHourlyValueBaseDTO {}

export class MatsDerivedHourlyValueDTO extends MatsDerivedHourlyValueRecordDTO {}
