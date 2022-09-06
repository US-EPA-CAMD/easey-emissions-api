import { faker } from '@faker-js/faker';
import { DailyEmission } from '../../src/entities/daily-emission.entity';
import { HrlyOpData } from '../../src/entities/hrly-op-data.entity';
import { Nsps4tSummary } from '../../src/entities/nsps4t-summary.entity';
import { SummaryValue } from '../../src/entities/summary-value.entity';
import { genDailyTestSummary } from './daily-test-summary';
import { HrlyGasFlowMeter } from '../../src/entities/hrly-gas-flow-meter.entity';
import { LongTermFuelFlow } from '../../src/entities/long-term-fuel-flow.entity';
import { MatsDerivedHrlyValue } from '../../src/entities/mats-derived-hrly-value.entity';
import { MatsMonitorHrlyValue } from '../../src/entities/mats-monitor-hrly-value.entity';
import { Nsps4tAnnual } from '../../src/entities/nsps4t-annual.entity';
import { Nsps4tCompliancePeriod } from '../../src/entities/nsps4t-compliance-period.entity';
import { SorbentTrap } from '../../src/entities/sorbent-trap.entity';
import { WeeklyTestSummary } from '../../src/entities/weekly-test-summary.entity';
import { SamplingTrain } from '../../src/entities/sampling-train.entity';
import { genEmissionEvaluation } from './emission-evaluation';

type GenReportingPeriodConfig = {
  include?: Array<
    | 'dailyEmissions'
    | 'hrlyOpData'
    | 'nsps4tSummaries'
    | 'summaryValues'
    | 'dailyTestSummaries'
    | 'hrlyGasFlowMeters'
    | 'longTermFuelFlows'
    | 'matsDerivedHrlyValues'
    | 'matsMonitorHrlyValues'
    | 'nsps4tAnnuals'
    | 'nsps4tCompliancePeriods'
    | 'sorbentTraps'
    | 'weeklyTestSummaries'
    | 'samplingTrains'
    | 'emissionEvaluations'
  >;
  dailyTestSummaryAmount?: number;
  emissionEvaluationAmount?: number;
};

export const genReportingPeriod = (
  amount = 1,
  config?: GenReportingPeriodConfig,
) => {
  const periods = [];

  for (let period = 0; period < amount; period++) {
    periods.push({
      id: faker.datatype.number(),
      year: faker.date.soon().getFullYear(),
      quarter: faker.datatype.number({ min: 1, max: 4 }),
      beginDate: faker.datatype.datetime(),
      endDate: faker.datatype.datetime(),
      periodDescription: faker.datatype.string(),
      periodAbbreviation: faker.datatype.string(),
      archiveInd: faker.datatype.number(),
      dailyEmissions: config?.include?.includes('dailyEmissions')
        ? [new DailyEmission()]
        : undefined,
      hrlyOpData: config?.include?.includes('hrlyOpData')
        ? [new HrlyOpData()]
        : undefined,
      nsps4tSummaries: config?.include?.includes('nsps4tSummaries')
        ? [new Nsps4tSummary()]
        : undefined,
      summaryValues: config?.include?.includes('summaryValues')
        ? [new SummaryValue()]
        : undefined,
      dailyTestSummaries: config?.include?.includes('dailyTestSummaries')
        ? genDailyTestSummary(config?.dailyTestSummaryAmount)
        : undefined,
      hrlyGasFlowMeters: config?.include?.includes('hrlyGasFlowMeters')
        ? [new HrlyGasFlowMeter()]
        : undefined,
      longTermFuelFlows: config?.include?.includes('longTermFuelFlows')
        ? [new LongTermFuelFlow()]
        : undefined,
      matsDerivedHrlyValues: config?.include?.includes('matsDerivedHrlyValues')
        ? [new MatsDerivedHrlyValue()]
        : undefined,
      matsMonitorHrlyValues: config?.include?.includes('matsMonitorHrlyValues')
        ? [new MatsMonitorHrlyValue()]
        : undefined,
      nsps4tAnnuals: config?.include?.includes('nsps4tAnnuals')
        ? [new Nsps4tAnnual()]
        : undefined,
      nsps4tCompliancePeriods: config?.include?.includes(
        'nsps4tCompliancePeriods',
      )
        ? [new Nsps4tCompliancePeriod()]
        : undefined,
      sorbentTraps: config?.include?.includes('sorbentTraps')
        ? [new SorbentTrap()]
        : undefined,
      weeklyTestSummaries: config?.include?.includes('weeklyTestSummaries')
        ? [new WeeklyTestSummary()]
        : undefined,
      samplingTrains: config?.include?.includes('samplingTrains')
        ? [new SamplingTrain()]
        : undefined,
      emissionEvaluations: config?.include?.includes('emissionEvaluations')
        ? genEmissionEvaluation(config?.emissionEvaluationAmount)
        : undefined,
    });
  }

  return periods;
};
