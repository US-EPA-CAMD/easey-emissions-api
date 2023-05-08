import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  ValidationArguments,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  Nsps4tCompliancePeriodDTO,
  Nsps4tCompliancePeriodImportDTO,
} from './nsps4t-compliance-period.dto';
import { Nsps4tAnnualDTO, Nsps4tAnnualImportDTO } from './nsps4t-annual.dto';
import { IsValidCode } from '@us-epa-camd/easey-common/pipes';
import { Nsps4tElectricalLoadCode } from '../entities/nsps4t_electrical_load_code.entity';
import { ImportCodeErrorMessage } from '../utils/validator.const';
import { Nsps4tEmissionStandardCode } from '../entities/nsps4t-emission-standard-code.entity';
import { UnitsOfMeasureCode } from '../entities/units-of-measure.entity';

export class Nsps4tSummaryBaseDTO {
  @IsOptional()
  @IsString()
  stackPipeId?: string;

  @IsOptional()
  @IsString()
  unitId?: string;

  @IsOptional()
  @IsString()
  @IsValidCode(Nsps4tEmissionStandardCode, {
    message: (args: ValidationArguments) => {
      return ImportCodeErrorMessage(args.property, args.value);
    },
  })
  co2EmissionStandardCode?: string;

  @IsOptional()
  @IsNumber()
  modusValue?: number;

  @IsOptional()
  @IsString()
  @IsValidCode(UnitsOfMeasureCode, {
    message: (args: ValidationArguments) => {
      return ImportCodeErrorMessage(args.property, args.value);
    },
  })
  modusUomCode?: string;

  @IsOptional()
  @IsString()
  @IsValidCode(Nsps4tElectricalLoadCode, {
    message: (args: ValidationArguments) => {
      return ImportCodeErrorMessage(args.property, args.value);
    },
  })
  electricalLoadCode?: string;

  @IsOptional()
  @IsNumber()
  noCompliancePeriodEndedIndicator?: number;

  @IsOptional()
  @IsString()
  noCompliancePeriodEndedComment?: string;
}

export class Nsps4tSummaryRecordDTO extends Nsps4tSummaryBaseDTO {
  id: string;
  monitoringLocationId: string;
  reportingPeriodId: number;
  userId: string;
  addDate: Date;
  updateDate?: Date;
}

export class Nsps4tSummaryImportDTO extends Nsps4tSummaryBaseDTO {
  @ValidateNested({ each: true })
  @Type(() => Nsps4tCompliancePeriodImportDTO)
  nsps4tCompliancePeriodData: Nsps4tCompliancePeriodImportDTO[];

  @ValidateNested({ each: true })
  @Type(() => Nsps4tAnnualImportDTO)
  nsps4tFourthQuarterData: Nsps4tAnnualImportDTO[];
}

export class Nsps4tSummaryDTO extends Nsps4tSummaryRecordDTO {
  @ValidateNested({ each: true })
  @Type(() => Nsps4tCompliancePeriodDTO)
  nsps4tCompliancePeriodData: Nsps4tCompliancePeriodDTO[];

  @ValidateNested({ each: true })
  @Type(() => Nsps4tAnnualDTO)
  nsps4tFourthQuarterData: Nsps4tAnnualDTO[];
}
