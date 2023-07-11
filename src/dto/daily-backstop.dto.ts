import {
IsOptional,
IsString,
IsNumber,
IsDateString,
} from 'class-validator';

export class DailyBackstopBaseDTO {
    @IsString()
    unitId?: string;
    
    @IsDateString()
    date: Date;
  
    @IsNumber()
    dailyNOxEmissions?: number;
  
    @IsNumber()
    dailyHeatInput?: number;
    
    @IsNumber()
    dailyAverageNOxRate?: number;
  
    @IsNumber()
    dailyNOxExceedence?: number;

    @IsNumber()
    cumulativeOSNOxExceedence?: number;
  }

export class DailyBackstopRecordDTO extends DailyBackstopBaseDTO{
  id: string;
  monitoringLocationId: string;
  userId?: string;
  addDate?: string;
  updateDate?: string;
  reportingPeriodId?: number;  
}

export class DailyBackstopImportDTO extends DailyBackstopBaseDTO {}

export class DailyBackstopDTO extends DailyBackstopRecordDTO {}
