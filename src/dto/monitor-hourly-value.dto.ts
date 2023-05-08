import { IsValidCode } from '@us-epa-camd/easey-common/pipes';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidationArguments,
} from 'class-validator';
import { ParameterCode } from '../entities/parameter-code.entity';
import { ImportCodeErrorMessage } from '../utils/validator.const';
import { ModcCode } from '../entities/modc-code.entity';

export class MonitorHourlyValueBaseDTO {
  @IsString()
  @IsValidCode(ParameterCode, {
    message: (args: ValidationArguments) => {
      return ImportCodeErrorMessage(args.property, args.value);
    },
  })
  parameterCode: string;

  @IsOptional()
  @IsNumber()
  unadjustedHourlyValue?: number;

  @IsOptional()
  @IsNumber()
  adjustedHourlyValue?: number;

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
  monitoringSystemId?: string;

  @IsOptional()
  @IsString()
  componentId?: string;

  @IsOptional()
  @IsNumber()
  percentAvailable?: number;

  @IsOptional()
  @IsString()
  moistureBasis?: string;
}

export class MonitorHourlyValueRecordDTO extends MonitorHourlyValueBaseDTO {
  id: string;
  hourId: string;
  monitoringSystemRecordId?: string;
  componentRecordId?: string;
  biasAdjustmentFactor?: number;
  calcAdjustedHrlyValue?: number;
  userId?: string;
  addDate?: Date;
  updateDate?: Date;
  calcLineStatus?: string;
  calcRataStatus?: string;
  calcDaycalStatus?: string;
  reportingPeriodId: number;
  monitoringLocationId: string;
  calcLeakStatus?: string;
  calcDayintStatus?: string;
  calcF2lStatus?: string;
}

export class MonitorHourlyValueImportDTO extends MonitorHourlyValueBaseDTO {}

export class MonitorHourlyValueDTO extends MonitorHourlyValueRecordDTO {}
