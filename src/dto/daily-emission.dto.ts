import { ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { DailyFuelDTO, DailyFuelImportDTO } from './daily-fuel.dto';
import moment from 'moment';

export class DailyEmissionBaseDTO {
  stackPipeId?: string;
  unitId?: string;
  parameterCode: string;
  @Transform(date => moment(date.value).format('YYYY-MM-DD'))
  date: Date;
  totalDailyEmissions?: number;
  adjustedDailyEmissions?: number;
  sorbentRelatedMassEmissions?: number;
  unadjustedDailyEmissions?: number;
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
