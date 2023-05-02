import { IsNumber, IsOptional, IsString } from 'class-validator';

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
  id: string;
  dailyEmissionId: string;
  calcFuelCarbonBurned?: number;
  userId: string;
  addDate: Date;
  updateDate?: Date;
  reportingPeriodId: number;
  monitoringLocationId: string;
}

export class DailyFuelImportDTO extends DailyFuelBaseDTO {}

export class DailyFuelDTO extends DailyFuelRecordDTO {}
