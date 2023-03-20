import { IsOptional, IsString, ValidateNested, IsNumber, IsDate } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { DailyFuelDTO, DailyFuelImportDTO } from './daily-fuel.dto';
import moment from 'moment';

export class DailyEmissionBaseDTO {
  @IsOptional()
  @IsString()
  stackPipeId?: string;
  @IsOptional()
  @IsString()
  unitId?: string;
  @IsString()
  parameterCode: string;
  @IsDate()
  @Transform(date => moment(date.value).format('YYYY-MM-DD'))
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
  @IsString()
  id: string;
  @IsNumber()
  reportingPeriodId: number;
  @IsString()
  monitoringLocationId: string;
  @IsOptional()
  @IsString()
  userId?: string;
  @IsOptional()
  @IsDate()
  addDate?: Date;
  @IsOptional()
  @IsDate()
  updateDate?: Date;
  @IsOptional()
  @IsNumber()
  calcTotalDailyEmissions?: number;
  @IsOptional()
  @IsNumber()
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
