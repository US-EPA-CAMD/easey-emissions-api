import { IsValidCode } from '@us-epa-camd/easey-common/pipes';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidationArguments,
} from 'class-validator';
import { UnitsOfMeasureCode } from '../entities/units-of-measure.entity';
import { ImportCodeErrorMessage } from '../utils/validator.const';

export class Nsps4tCompliancePeriodBaseDTO {
  @IsOptional()
  @IsNumber()
  beginYear?: number;

  @IsOptional()
  @IsNumber()
  beginMonth?: number;

  @IsOptional()
  @IsNumber()
  endYear?: number;

  @IsOptional()
  @IsNumber()
  endMonth?: number;

  @IsOptional()
  @IsNumber()
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
  percentValidOpHours?: number;

  @IsOptional()
  @IsNumber()
  violationOfCO2StandardIndicator?: number;

  @IsOptional()
  @IsString()
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
