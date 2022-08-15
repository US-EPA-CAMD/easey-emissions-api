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

export class EmissionsBaseDTO {
  orisCode: number;
  year: number;
  quarter: number;
  submissionComment?: string;
}

export class EmissionsRecordDTO extends EmissionsBaseDTO {
  monitorPlanId: string;
  reportingPeriodId: number;
  lastUpdated?: Date;
  updatedStatusFlg?: string;
  needsEvalFlag?: string;
  chkSessionId?: string;
  submissionId?: number;
  submissionAvailabilityCd?: string;
}

export class EmissionsImportDTO extends EmissionsBaseDTO {
  dailyEmissionData: DailyEmissionImportDTO[];
  weeklyTestSummaryData: WeeklyTestSummaryImportDTO[];
  summaryValueData: SummaryValueImportDTO[];
  dailyTestSummaryData: DailyTestSummaryImportDTO[];
  hourlyOperatingData: HourlyOperatingImportDTO[];
  longTermFuelFlowData: LongTermFuelFlowImportDTO[];
  sorbentTrapData: SorbentTrapImportDTO[];
  nsps4tSummaryData: Nsps4tSummaryImportDTO[];
}

export class EmissionsDTO extends EmissionsRecordDTO {
  dailyEmissionData: DailyEmissionDTO[];
  weeklyTestSummaryData: WeeklyTestSummaryDTO[];
  summaryValueData: SummaryValueDTO[];
  dailyTestSummaryData: DailyTestSummaryDTO[];
  hourlyOperatingData: HourlyOperatingDTO[];
  longTermFuelFlowData: LongTermFuelFlowDTO[];
  sorbentTrapData: SorbentTrapDTO[];
  nsps4tSummaryData: Nsps4tSummaryDTO[];
}
