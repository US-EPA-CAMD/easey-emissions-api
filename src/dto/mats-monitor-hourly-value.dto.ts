import { IsValidCode } from '@us-epa-camd/easey-common/pipes';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ModcCode } from '../entities/modc-code.entity';
import { ParameterCode } from '../entities/parameter-code.entity';
import { ImportCodeErrorMessage } from '../utils/validator.const';

export class MatsMonitorHourlyValueBaseDTO {
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
  addDate?: Date;
  updateDate?: Date;
}

export class MatsMonitorHourlyValueImportDTO extends MatsMonitorHourlyValueBaseDTO {}

export class MatsMonitorHourlyValueDTO extends MatsMonitorHourlyValueRecordDTO {}
