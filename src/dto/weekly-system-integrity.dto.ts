import { IsValidCode } from '@us-epa-camd/easey-common/pipes';
import { IsNumber, IsString } from 'class-validator';
import { GasLevelCode } from '../entities/gas-level-code.entity';
import { ImportCodeErrorMessage } from '../utils/validator.const';

export class WeeklySystemIntegrityBaseDTO {
  @IsString()
  @IsValidCode(GasLevelCode, {
    message: ImportCodeErrorMessage(),
  })
  gasLevelCode?: string;

  @IsNumber()
  referenceValue?: number;

  @IsNumber()
  measuredValue?: number;

  @IsNumber()
  apsIndicator?: number;

  @IsNumber()
  systemIntegrityError?: number;
}

export class WeeklySystemIntegrityRecordDTO extends WeeklySystemIntegrityBaseDTO {
  id: string;
  weeklyTestSumId: string;
  calcSystemIntegrityError?: number;
  calcApsInd?: number;
  userId?: string;
  addDate?: Date;
  updateDate?: Date;
  reportingPeriodId: number;
  monitoringLocationId: string;
}

export class WeeklySystemIntegrityImportDTO extends WeeklySystemIntegrityBaseDTO {}

export class WeeklySystemIntegrityDTO extends WeeklySystemIntegrityRecordDTO {}
