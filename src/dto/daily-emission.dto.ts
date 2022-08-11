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
  @Type(() => DailyEmissionImportDTO)
  dailyFuelData: DailyEmissionImportDTO[];
}

export class DailyEmissionDTO extends DailyEmissionRecordDTO {
  @ValidateNested({ each: true })
  @Type(() => DailyEmissionDTO)
  dailyFuelData: DailyEmissionDTO[];
}
