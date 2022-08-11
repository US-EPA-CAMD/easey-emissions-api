import {
  DailyFuelBaseDTO,
  DailyFuelDTO,
  DailyFuelImportDTO,
} from './daily-fuel.dto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class DailyEmissionBaseDTO {
  stackPipeId: string;
  unitId: string;
  parameterCode: string;
  date: Date;
  totalDailyEmissions?: number;
  adjustedDailyEmissions?: number;
  sorbentRelatedMassEmissions?: number;
  unadjustedDailyEmissions?: number;
  totalCarbonBurned?: number;
}

export class DailyEmissionRecordDTO extends DailyFuelBaseDTO {
  id: string;
  reportingPeriodId: number;
  monitoringLocationId: string;
  userId?: string;
  addDate?: Date;
  updateDate?: Date;
  calcTotalDailyEmissions?: number;
  calcTotalOpTime?: number;
}

export class DailyEmissionImportDTO extends DailyFuelBaseDTO {
  @ValidateNested({ each: true })
  @Type(() => DailyFuelImportDTO)
  dailyFuelData: DailyFuelImportDTO[];
}

export class DailyEmissionDTO extends DailyEmissionRecordDTO {
  @ValidateNested({ each: true })
  @Type(() => DailyFuelDTO)
  dailyFuelData: DailyFuelDTO[];
}
