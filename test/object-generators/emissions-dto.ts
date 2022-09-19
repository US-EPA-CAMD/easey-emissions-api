import { faker } from '@faker-js/faker';
import { optionalValue } from './util';
import {
  EmissionsBaseDTO,
  EmissionsDTO,
  EmissionsImportDTO,
} from '../../src/dto/emissions.dto';
import {
  DailyEmissionDTO,
  DailyEmissionImportDTO,
} from '../../src/dto/daily-emission.dto';
import {
  WeeklyTestSummaryDTO,
  WeeklyTestSummaryImportDTO,
} from '../../src/dto/weekly-test-summary.dto';
import {
  SummaryValueDTO,
  SummaryValueImportDTO,
} from '../../src/dto/summary-value.dto';
import { DailyTestSummaryDTO } from '../../src/dto/daily-test-summary.dto';
import {
  LongTermFuelFlowDTO,
  LongTermFuelFlowImportDTO,
} from '../../src/dto/long-term-fuel-flow.dto';
import {
  SorbentTrapDTO,
  SorbentTrapImportDTO,
} from '../../src/dto/sorbent-trap.dto';
import {
  Nsps4tSummaryDTO,
  Nsps4tSummaryImportDTO,
} from '../../src/dto/nsps4t-summary.dto';
import { EmissionsParamsDTO } from '../../src/dto/emissions.params.dto';
import { genDailyTestSummary } from './daily-test-summary';
import {
  genHourlyOperatingImportDto,
  HourlyOperatingImportDtoConfig,
} from './hourly-operating-dto';
import { genHourlyOpValues } from './hourly-op-data-values';

type GenEmissionsDtoConfig = {
  include?: Array<
    | 'dailyEmissionData'
    | 'weeklyTestSummaryData'
    | 'summaryValueData'
    | 'dailyTestSummaryData'
    | 'hourlyOperatingData'
    | 'longTermFuelFlowData'
    | 'sorbentTrapData'
    | 'nsps4tSummaryData'
  >;
  dailyTestSummaryAmount?: number;
  hourlyOperatingAmount?: number;
  hourlyOperatingImportConfig?: HourlyOperatingImportDtoConfig;
};

export const genEmissionsParamsDto = (amount = 1) => {
  const dtos: EmissionsParamsDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      monitorPlanId: faker.datatype.string(),
      quarter: faker.datatype.number({ min: 1, max: 4 }),
      year: faker.date.soon().getFullYear(),
    });
  }

  return dtos;
};

export const genEmissionBaseDto = (amount = 1) => {
  const dtos: EmissionsBaseDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      orisCode: faker.datatype.number(),
      year: faker.date.soon().getFullYear(),
      quarter: faker.datatype.number({ min: 1, max: 4 }),
      submissionComment: optionalValue(faker.datatype.string()),
    });
  }

  return dtos;
};

export const genEmissionsImportDto = (
  amount = 1,
  config?: GenEmissionsDtoConfig,
) => {
  const dtos: EmissionsImportDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      ...genEmissionBaseDto()[0],
      submissionComment: optionalValue(faker.datatype.string()),
      dailyEmissionData: config?.include?.includes('dailyEmissionData')
        ? [new DailyEmissionImportDTO()]
        : undefined,
      weeklyTestSummaryData: config?.include?.includes('weeklyTestSummaryData')
        ? [new WeeklyTestSummaryImportDTO()]
        : undefined,
      summaryValueData: config?.include?.includes('summaryValueData')
        ? [new SummaryValueImportDTO()]
        : undefined,
      dailyTestSummaryData: config?.include?.includes('dailyTestSummaryData')
        ? genDailyTestSummary(config?.dailyTestSummaryAmount)
        : undefined,
      hourlyOperatingData: config?.include?.includes('hourlyOperatingData')
        ? genHourlyOperatingImportDto(
            config?.hourlyOperatingAmount,
            config?.hourlyOperatingImportConfig,
          )
        : undefined,
      longTermFuelFlowData: config?.include?.includes('longTermFuelFlowData')
        ? [new LongTermFuelFlowImportDTO()]
        : undefined,
      sorbentTrapData: config?.include?.includes('sorbentTrapData')
        ? [new SorbentTrapImportDTO()]
        : undefined,
      nsps4tSummaryData: config?.include?.includes('nsps4tSummaryData')
        ? [new Nsps4tSummaryImportDTO()]
        : undefined,
    });
  }

  return dtos;
};

export const genEmissionsRecordDto = (
  amount = 1,
  config?: GenEmissionsDtoConfig,
): EmissionsDTO[] => {
  const dtos: EmissionsDTO[] = [];

  for (let dto = 0; dto < amount; dto++) {
    dtos.push({
      ...genEmissionBaseDto()[0],
      monitorPlanId: faker.datatype.string(),
      reportingPeriodId: faker.datatype.number(),
      lastUpdated: optionalValue(faker.datatype.datetime()),
      updatedStatusFlg: optionalValue(faker.datatype.string()),
      needsEvalFlag: optionalValue(faker.datatype.string()),
      chkSessionId: optionalValue(faker.datatype.string()),
      submissionId: optionalValue(faker.datatype.number()),
      submissionAvailabilityCd: optionalValue(faker.datatype.string()),
      dailyEmissionData: config?.include?.includes('dailyEmissionData')
        ? [new DailyEmissionDTO()]
        : undefined,
      weeklyTestSummaryData: config?.include?.includes('weeklyTestSummaryData')
        ? [new WeeklyTestSummaryDTO()]
        : undefined,
      summaryValueData: config?.include?.includes('summaryValueData')
        ? [new SummaryValueDTO()]
        : undefined,
      dailyTestSummaryData: config?.include?.includes('dailyTestSummaryData')
        ? [new DailyTestSummaryDTO()]
        : undefined,
      hourlyOperatingData: config?.include?.includes('hourlyOperatingData')
        ? genHourlyOpValues(config?.hourlyOperatingAmount)
        : undefined,
      longTermFuelFlowData: config?.include?.includes('longTermFuelFlowData')
        ? [new LongTermFuelFlowDTO()]
        : undefined,
      sorbentTrapData: config?.include?.includes('sorbentTrapData')
        ? [new SorbentTrapDTO()]
        : undefined,
      nsps4tSummaryData: config?.include?.includes('nsps4tSummaryData')
        ? [new Nsps4tSummaryDTO()]
        : undefined,
    });
  }

  return dtos;
};
