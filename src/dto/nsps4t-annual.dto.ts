import { IsInRange } from '@us-epa-camd/easey-common/pipes';
import {
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class Nsps4tAnnualBaseDTO {
  @IsOptional()
  @IsNumber()
  @IsInRange(0, 99999999)
  annualEnergySold?: number;

  @IsOptional()
  @IsString()
  // @IsValidCode(Nsps4tElectricalLoadCode, {
  //   message: (args: ValidationArguments) => {
  //     return ImportCodeErrorMessage(args.property, args.value);
  //   },
  // })
  annualEnergySoldTypeCode?: string;

  @IsOptional()
  @IsNumber()
  @IsInRange(0, 99999999)
  annualPotentialElectricOutput?: number;
}

export class Nsps4tAnnualRecordDTO extends Nsps4tAnnualBaseDTO {
  id: string;
  nsps4tSumId: string;
  monitoringLocationId: string;
  reportingPeriodId: number;
  userId: string;
  addDate?: string;
  updateDate?: string;
}

export class Nsps4tAnnualImportDTO extends Nsps4tAnnualBaseDTO {}

export class Nsps4tAnnualDTO extends Nsps4tAnnualRecordDTO {}
