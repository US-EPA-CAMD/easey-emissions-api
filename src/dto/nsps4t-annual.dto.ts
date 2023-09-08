import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class Nsps4tAnnualBaseDTO {
  @IsOptional()
  @IsNumber()
  @Min(0)
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
  @Min(0)
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
