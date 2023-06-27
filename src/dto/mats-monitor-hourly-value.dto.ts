import { IsValidCode } from '@us-epa-camd/easey-common/pipes';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidationArguments,
} from 'class-validator';
import { ModcCode } from '../entities/modc-code.entity';
import { ParameterCode } from '../entities/parameter-code.entity';
import { ImportCodeErrorMessage } from '../utils/validator.const';

export class MatsMonitorHourlyValueBaseDTO {
  @IsString()
  @IsValidCode(ParameterCode, {
    message: (args: ValidationArguments) => {
      return ImportCodeErrorMessage(args.property, args.value);
    },
  })
  parameterCode: string;

  @IsOptional()
  @IsString()
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
  monitoringSystemId?: string;

  @IsOptional()
  @IsString()
  componentId?: string;

  @IsOptional()
  @IsNumber()
  percentAvailable?: number;
}

export class MatsMonitorHourlyValueRecordDTO extends MatsMonitorHourlyValueBaseDTO {
  id: string;
  hourId: string;
  monitoringLocationId?: string;
  reportingPeriodId: number;
  monitoringSystemRecordId?: string;
  componentRecordId?: string;
  calcUnadjustedHrlyValue?: string;
  calcDailyCalStatus?: string;
  calcHgLineStatus?: string;
  calcHgi1Status?: string;
  calcRataStatus?: string;
  userId?: string;
  addDate?: string;
  updateDate?: string;
}

export class MatsMonitorHourlyValueImportDTO extends MatsMonitorHourlyValueBaseDTO {}

export class MatsMonitorHourlyValueDTO extends MatsMonitorHourlyValueRecordDTO {}
