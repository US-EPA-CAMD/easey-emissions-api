import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class DailyFuelBaseDTO {
  @IsString()
  fuelCode: string;
  @IsOptional()
  @IsNumber()
  dailyFuelFeed?: number;
  @IsNumber()
  carbonContentUsed: number;
  @IsOptional()
  @IsNumber()
  fuelCarbonBurned?: number;
}

export class DailyFuelRecordDTO extends DailyFuelBaseDTO {
  @IsString()
  id: string;
  @IsString()
  dailyEmissionId: string;
  @IsOptional()
  @IsNumber()
  calcFuelCarbonBurned?: number;
  @IsString()
  userId: string;
  @IsDateString()
  addDate: Date;
  @IsOptional()
  @IsDateString()
  updateDate?: Date;
  @IsNumber()
  reportingPeriodId: number;
  @IsString()
  monitoringLocationId: string;
}

export class DailyFuelImportDTO extends DailyFuelBaseDTO {}

export class DailyFuelDTO extends DailyFuelRecordDTO {}
