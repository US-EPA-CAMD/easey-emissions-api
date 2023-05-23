import { IsValidCode } from '@us-epa-camd/easey-common/pipes';
import { IsNumber, IsString, ValidationArguments } from 'class-validator';
import { GasLevelCode } from '../entities/gas-level-code.entity';
import { ImportCodeErrorMessage } from '../utils/validator.const';

export class WeeklySystemIntegrityBaseDTO {
  @IsString()
  @IsValidCode(GasLevelCode, {
    message: (args: ValidationArguments) => {
      return ImportCodeErrorMessage(args.property, args.value);
    },
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
  addDate?: string;
  updateDate?: string;
  reportingPeriodId: number;
  monitoringLocationId: string;
}

export class WeeklySystemIntegrityImportDTO extends WeeklySystemIntegrityBaseDTO {}

export class WeeklySystemIntegrityDTO extends WeeklySystemIntegrityRecordDTO {}
