import {
  IsOptional,
  IsString,
  ValidateNested,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DailyFuelDTO, DailyFuelImportDTO } from './daily-fuel.dto';

export class DailyEmissionBaseDTO {
  @IsOptional()
  @IsString()
  stackPipeId?: string;

  @IsOptional()
  @IsString()
  unitId?: string;

  @IsString()
  parameterCode: string;

  @IsDateString()
  date: Date;

  @IsOptional()
  @IsNumber()
  totalDailyEmissions?: number;

  @IsOptional()
  @IsNumber()
  adjustedDailyEmissions?: number;

  @IsOptional()
  @IsNumber()
  sorbentRelatedMassEmissions?: number;

  @IsOptional()
  @IsNumber()
  unadjustedDailyEmissions?: number;

  @IsOptional()
  @IsNumber()
  totalCarbonBurned?: number;
}

export class DailyEmissionRecordDTO extends DailyEmissionBaseDTO {
  id: string;
  reportingPeriodId: number;
  monitoringLocationId: string;
  userId?: string;
  addDate?: Date;
  updateDate?: Date;
  calcTotalDailyEmissions?: number;
  calcTotalOpTime?: number;
}

export class DailyEmissionImportDTO extends DailyEmissionBaseDTO {
  @ValidateNested({ each: true })
  @Type(() => DailyFuelImportDTO)
  dailyFuelData: DailyFuelImportDTO[];
}

export class DailyEmissionDTO extends DailyEmissionRecordDTO {
  @ValidateNested({ each: true })
  @Type(() => DailyFuelDTO)
  dailyFuelData: DailyFuelDTO[];
}
