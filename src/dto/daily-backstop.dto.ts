import {
IsOptional,
IsString,
ValidateNested,
IsNumber,
IsDateString,
ValidationArguments,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DailyFuelDTO, DailyFuelImportDTO } from './daily-fuel.dto';
import { IsValidCode } from '@us-epa-camd/easey-common/pipes';
import { ImportCodeErrorMessage } from '../utils/validator.const';
import { ParameterCode } from '../entities/parameter-code.entity';


export class DailyBackstopBaseDTO {
    @IsString()
    unitId?: string;
    
    @IsDateString()
    date: Date;
  
    @IsNumber()
    dailyNOxEmissions?: number;
  
    @IsNumber()
    dailyHeatInput?: number;
  
    @IsOptional()
    @IsNumber()
    sorbentRelatedMassEmissions?: number;
  
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
