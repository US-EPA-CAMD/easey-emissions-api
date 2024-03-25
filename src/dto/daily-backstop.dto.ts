import { IsIsoFormat, IsValidDate } from '@us-epa-camd/easey-common/pipes';
import {
IsString,
IsNumber,
} from 'class-validator';

export class DailyBackstopBaseDTO {
    @IsString()
    unitId?: string;
    
    @IsIsoFormat()
    @IsValidDate()
    date: Date;
  
    @IsNumber()
    dailyNoxEmissions?: number;
  
    @IsNumber()
    dailyHeatInput?: number;
    
    @IsNumber()
    dailyAverageNoxRate?: number;
  
    @IsNumber()
    dailyNoxExceedence?: number;

    @IsNumber()
    cumulativeOsNoxExceedence?: number;
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
