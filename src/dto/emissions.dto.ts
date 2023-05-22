import { FindOneOptions } from 'typeorm';
import { Type } from 'class-transformer';
import { IsDateString, IsNotEmptyObject, IsNumber, IsOptional, IsString, ValidateNested, ValidationArguments } from 'class-validator';
import { Plant } from '../entities/plant.entity';
import { DbLookup } from '../pipes/db-lookup.pipe';
import { DailyEmissionDTO, DailyEmissionImportDTO } from './daily-emission.dto';
import {
  DailyTestSummaryDTO,
  DailyTestSummaryImportDTO,
} from './daily-test-summary.dto';
import {
  HourlyOperatingDTO,
  HourlyOperatingImportDTO,
} from './hourly-operating.dto';
import {
  LongTermFuelFlowDTO,
  LongTermFuelFlowImportDTO,
} from './long-term-fuel-flow.dto';
import { Nsps4tSummaryDTO, Nsps4tSummaryImportDTO } from './nsps4t-summary.dto';
import { SorbentTrapDTO, SorbentTrapImportDTO } from './sorbent-trap.dto';
import { SummaryValueDTO, SummaryValueImportDTO } from './summary-value.dto';
import {
  WeeklyTestSummaryDTO,
  WeeklyTestSummaryImportDTO,
} from './weekly-test-summary.dto';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

export class EmissionsBaseDTO {
  @DbLookup(
    Plant,
    (args: ValidationArguments): FindOneOptions<Plant> => {
      return { where: { orisCode: args.value } };
    },
    {
      message: (args: ValidationArguments) => {
        return CheckCatalogService.formatResultMessage('IMPORT-25-A', {
          orisCode: args.value,
        });
      },
    },
  )
  @IsNumber()
  orisCode: number;
  @IsNumber()
  year: number;
  @IsNumber()
  quarter: number;
  @IsOptional()
  @IsString()
  submissionComment?: string;

  constructor(values: Object) {
    Object.assign(this, values);
  }

}

export class EmissionsRecordDTO extends EmissionsBaseDTO {
  @IsString()
  monitorPlanId: string;
  @IsNumber()
  reportingPeriodId: number;
  @IsOptional()
  @IsDateString()
  lastUpdated?: Date;
  @IsOptional()
  @IsString()
  updatedStatusFlg?: string;
  @IsOptional()
  @IsString()
  needsEvalFlag?: string;
  @IsOptional()
  @IsString()
  chkSessionId?: string;
  @IsOptional()
  @IsNumber()
  submissionId?: number;
  @IsOptional()
  @IsString()
  submissionAvailabilityCd?: string;

  constructor(values: Object = {}) {
    super(values)
    Object.assign(this, values);
  }
}

export class EmissionsImportDTO extends EmissionsBaseDTO {
  @ValidateNested({ each: true })
  @Type(() => DailyEmissionImportDTO)
  dailyEmissionData: DailyEmissionImportDTO[];

  @ValidateNested({ each: true })
  @Type(() => WeeklyTestSummaryImportDTO)
  weeklyTestSummaryData: WeeklyTestSummaryImportDTO[];

  @ValidateNested({ each: true })
  @Type(() => SummaryValueImportDTO)
  summaryValueData: SummaryValueImportDTO[];

  @ValidateNested({ each: true })
  @Type(() => DailyTestSummaryImportDTO)
  dailyTestSummaryData: DailyTestSummaryImportDTO[];

  @ValidateNested({ each: true })
  @Type(() => HourlyOperatingImportDTO)
  hourlyOperatingData: HourlyOperatingImportDTO[];

  @ValidateNested({ each: true })
  @Type(() => LongTermFuelFlowImportDTO)
  longTermFuelFlowData: LongTermFuelFlowImportDTO[];

  @ValidateNested({ each: true })
  @Type(() => SorbentTrapImportDTO)
  sorbentTrapData: SorbentTrapImportDTO[];

  @ValidateNested({ each: true })
  @Type(() => Nsps4tSummaryImportDTO)
  nsps4tSummaryData: Nsps4tSummaryImportDTO[];
}

export class EmissionsDTO extends EmissionsRecordDTO {
  @ValidateNested({ each: true })
  @Type(() => DailyEmissionDTO)
  dailyEmissionData: DailyEmissionDTO[];

  @ValidateNested({ each: true })
  @Type(() => WeeklyTestSummaryDTO)
  weeklyTestSummaryData: WeeklyTestSummaryDTO[];

  @ValidateNested({ each: true })
  @Type(() => SummaryValueDTO)
  summaryValueData: SummaryValueDTO[];

  @ValidateNested({ each: true })
  @Type(() => DailyTestSummaryDTO)
  dailyTestSummaryData: DailyTestSummaryDTO[];

  @ValidateNested({ each: true })
  @Type(() => HourlyOperatingDTO)
  hourlyOperatingData: HourlyOperatingDTO[];

  @ValidateNested({ each: true })
  @Type(() => LongTermFuelFlowDTO)
  longTermFuelFlowData: LongTermFuelFlowDTO[];

  @ValidateNested({ each: true })
  @Type(() => SorbentTrapDTO)
  sorbentTrapData: SorbentTrapDTO[];

  @ValidateNested({ each: true })
  @Type(() => Nsps4tSummaryDTO)
  nsps4tSummaryData: Nsps4tSummaryDTO[];

  constructor(values: Object = {}) {
    super(values)
    Object.assign(this, values);
  }
}
