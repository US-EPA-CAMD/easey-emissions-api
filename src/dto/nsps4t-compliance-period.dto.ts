import { IsValidCode } from '@us-epa-camd/easey-common/pipes';
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidationArguments,
} from 'class-validator';
import { UnitsOfMeasureCode } from '../entities/units-of-measure.entity';
import { ImportCodeErrorMessage } from '../utils/validator.const';

export class Nsps4tCompliancePeriodBaseDTO {
  @IsOptional()
  @IsNumber()
  @Min(2000)
  @Max(2099)
  beginYear?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(12)
  beginMonth?: number;

  @IsOptional()
  @IsNumber()
  @Min(2000)
  @Max(2099)
  endYear?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(12)
  endMonth?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(99999)
  averageCO2EmissionRate?: number;

  @IsOptional()
  @IsString()
  @IsValidCode(UnitsOfMeasureCode, {
    message: (args: ValidationArguments) => {
      return ImportCodeErrorMessage(args.property, args.value);
    },
  })
  co2EmissionRateUnitsOfMeasureCode?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  percentValidOpHours?: number;

  @IsOptional()
  @IsNumber()
  @IsIn([0, 1])
  violationOfCO2StandardIndicator?: number;

  @IsOptional()
  @IsString()
  @MaxLength(3500)
  violationOfCO2StandardComment?: string;
}

export class Nsps4tCompliancePeriodRecordDTO extends Nsps4tCompliancePeriodBaseDTO {
  id: string;
  nsps4tSumId: string;
  monitoringLocationId: string;
  reportingPeriodId: number;
  userId: string;
  addDate?: string;
  updateDate?: string;
}

export class Nsps4tCompliancePeriodImportDTO extends Nsps4tCompliancePeriodBaseDTO {}

export class Nsps4tCompliancePeriodDTO extends Nsps4tCompliancePeriodRecordDTO {}
