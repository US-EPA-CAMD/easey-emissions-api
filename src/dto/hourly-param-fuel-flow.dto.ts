import { IsValidCode } from '@us-epa-camd/easey-common/pipes';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ParameterCode } from '../entities/parameter-code.entity';
import { ImportCodeErrorMessage } from '../utils/validator.const';
import { SampleTypeCode } from '../entities/sample-type-code.entity';
import { OperatingConditionCode } from '../entities/operating-condition-code.entity';
import { UnitsOfMeasureCode } from 'src/entities/units-of-measure.entity';

export class HourlyParamFuelFlowBaseDTO {
  @IsString()
  @IsValidCode(ParameterCode, {
    message: ImportCodeErrorMessage(),
  })
  parameterCode: string;

  @IsOptional()
  @IsNumber()
  parameterValueForFuel?: number;

  @IsOptional()
  @IsString()
  formulaIdentifier?: string;

  @IsOptional()
  @IsString()
  @IsValidCode(SampleTypeCode, {
    message: ImportCodeErrorMessage(),
  })
  sampleTypeCode?: string;

  @IsOptional()
  @IsString()
  monitoringSystemId?: string;

  @IsOptional()
  @IsString()
  @IsValidCode(OperatingConditionCode, {
    message: ImportCodeErrorMessage(),
  })
  operatingConditionCode?: string;

  @IsOptional()
  @IsNumber()
  segmentNumber?: number;

  @IsOptional()
  @IsString()
  @IsValidCode(UnitsOfMeasureCode, {
    message: ImportCodeErrorMessage(),
  })
  parameterUomCode?: string;
}

export class HourlyParamFuelFlowRecordDTO extends HourlyParamFuelFlowBaseDTO {
  id: string;
  hourlyFuelFlowId: string;
  monitoringFormulaRecordId?: string;
  calcParamValFuel?: number;
  userId?: string;
  addDate?: Date;
  updateDate?: Date;
  calcAppeStatus?: string;
  reportingPeriodId: number;
  monitoringLocationId: string;
}

export class HourlyParamFuelFlowImportDTO extends HourlyParamFuelFlowBaseDTO {}

export class HourlyParamFuelFlowDTO extends HourlyParamFuelFlowRecordDTO {}
