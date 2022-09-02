import { faker } from '@faker-js/faker';
import { StackPipe } from '../../src/entities/stack-pipe.entity';
import { Unit } from '../../src/entities/unit.entity';
import { MonitorPlan } from '../../src/entities/monitor-plan.entity';
import { DailyEmission } from '../../src/entities/daily-emission.entity';
import { HrlyOpData } from '../../src/entities/hrly-op-data.entity';
import { Nsps4tSummary } from '../../src/entities/nsps4t-summary.entity';
import { SummaryValue } from '../../src/entities/summary-value.entity';
import { LongTermFuelFlow } from '../../src/entities/long-term-fuel-flow.entity';
import { HrlyGasFlowMeter } from '../../src/entities/hrly-gas-flow-meter.entity';
import { MatsDerivedHrlyValue } from '../../src/entities/mats-derived-hrly-value.entity';
import { MatsMonitorHrlyValue } from '../../src/entities/mats-monitor-hrly-value.entity';
import { Nsps4tAnnual } from '../../src/entities/nsps4t-annual.entity';
import { Nsps4tCompliancePeriod } from '../../src/entities/nsps4t-compliance-period.entity';
import { SorbentTrap } from '../../src/entities/sorbent-trap.entity';
import { WeeklyTestSummary } from '../../src/entities/weekly-test-summary.entity';
import { SamplingTrain } from '../../src/entities/sampling-train.entity';
import { Component } from '../../src/entities/component.entity';
import { MonitorSystem } from '../../src/entities/monitor-system.entity';
import { genDailyTestSummary } from './daily-test-summary';
import { optionalValue } from './util';

type GenMonitorLocationConfig = {
  dailyTestSummaryAmount: number;
  include?: Array<
    | 'stackPipe'
    | 'unit'
    | 'monitorPlans'
    | 'dailyEmissions'
    | 'hrlyOpData'
    | 'nsps4tSummaries'
    | 'summaryValues'
    | 'dailyTestSummaries'
    | 'longTermFuelFlows'
    | 'hrlyGasFlowMeters'
    | 'matsDerivedHrlyValues'
    | 'matsMonitorHrlyValues'
    | 'nsps4tAnnuals'
    | 'nsps4tCompliancePeriods'
    | 'sorbentTraps'
    | 'weeklyTestSummaries'
    | 'samplingTrains'
    | 'components'
    | 'monitorSystems'
  >;
};

export const genMonitorLocation = <RepoType>(
  amount = 1,
  config?: GenMonitorLocationConfig,
): RepoType[] => {
  const locations: RepoType[] = [];
  for (let location = 0; location < amount; location++) {
    locations.push(({
      id: faker.datatype.string(),
      unitId: optionalValue(faker.datatype.string()),
      stackPipeId: optionalValue(faker.datatype.string()),
      userId: optionalValue(faker.datatype.string()),
      addDate: optionalValue(faker.datatype.datetime()),
      updateDate: optionalValue(faker.datatype.datetime()),
      stackPipe:
        config?.include?.includes('stackPipe') === true
          ? new StackPipe()
          : undefined,
      unit: config?.include?.includes('unit') === true ? new Unit() : undefined,
      monitorPlans:
        config?.include?.includes('monitorPlans') === true
          ? [new MonitorPlan()]
          : undefined,
      dailyEmissions:
        config?.include?.includes('dailyEmissions') === true
          ? [new DailyEmission()]
          : undefined,
      hrlyOpData:
        config?.include?.includes('hrlyOpData') === true
          ? [new HrlyOpData()]
          : undefined,
      nsps4tSummaries:
        config?.include?.includes('nsps4tSummaries') === true
          ? [new Nsps4tSummary()]
          : undefined,
      summaryValues:
        config?.include?.includes('summaryValues') === true
          ? [new SummaryValue()]
          : undefined,
      dailyTestSummaries:
        config?.include?.includes('dailyTestSummaries') === true
          ? genDailyTestSummary(config?.dailyTestSummaryAmount ?? 1)
          : undefined,
      longTermFuelFlows:
        config?.include?.includes('longTermFuelFlows') === true
          ? [new LongTermFuelFlow()]
          : undefined,
      hrlyGasFlowMeters:
        config?.include?.includes('hrlyGasFlowMeters') === true
          ? [new HrlyGasFlowMeter()]
          : undefined,
      matsDerivedHrlyValues:
        config?.include?.includes('matsDerivedHrlyValues') === true
          ? [new MatsDerivedHrlyValue()]
          : undefined,
      matsMonitorHrlyValues:
        config?.include?.includes('matsMonitorHrlyValues') === true
          ? [new MatsMonitorHrlyValue()]
          : undefined,
      nsps4tAnnuals:
        config?.include?.includes('nsps4tAnnuals') === true
          ? [new Nsps4tAnnual()]
          : undefined,
      nsps4tCompliancePeriods:
        config?.include?.includes('nsps4tCompliancePeriods') === true
          ? [new Nsps4tCompliancePeriod()]
          : undefined,
      sorbentTraps:
        config?.include?.includes('sorbentTraps') === true
          ? [new SorbentTrap()]
          : undefined,
      weeklyTestSummaries:
        config?.include?.includes('weeklyTestSummaries') === true
          ? [new WeeklyTestSummary()]
          : undefined,
      samplingTrains:
        config?.include?.includes('samplingTrains') === true
          ? [new SamplingTrain()]
          : undefined,
      components:
        config?.include?.includes('components') === true
          ? [new Component()]
          : undefined,
      monitorSystems:
        config?.include?.includes('monitorSystems') === true
          ? [new MonitorSystem()]
          : undefined,
    } as unknown) as RepoType);
  }

  return locations;
};
