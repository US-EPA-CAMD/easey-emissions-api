import { IsValidCode } from '@us-epa-camd/easey-common/pipes';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidationArguments,
} from 'class-validator';
import { Nsps4tElectricalLoadCode } from '../entities/nsps4t_electrical_load_code.entity';
import { ImportCodeErrorMessage } from '../utils/validator.const';

export class Nsps4tAnnualBaseDTO {
  @IsOptional()
  @IsNumber()
  annualEnergySold?: number;

  @IsOptional()
  @IsString()
  @IsValidCode(Nsps4tElectricalLoadCode, {
    message: (args: ValidationArguments) => {
      return ImportCodeErrorMessage(args.property, args.value);
    },
  })
  annualEnergySoldTypeCode?: string;

  @IsOptional()
  @IsNumber()
  annualPotentialElectricOutput?: number;
}

export class Nsps4tAnnualRecordDTO extends Nsps4tAnnualBaseDTO {
  id: string;
  nsps4tSumId: string;
  monitoringLocationId: string;
  reportingPeriodId: number;
  userId: string;
  addDate: Date;
  updateDate?: Date;
}

export class Nsps4tAnnualImportDTO extends Nsps4tAnnualBaseDTO {}

export class Nsps4tAnnualDTO extends Nsps4tAnnualRecordDTO {}
