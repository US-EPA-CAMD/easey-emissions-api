import { faker } from '@faker-js/faker';
import { ReportingPeriod } from '../../src/entities/reporting-period.entity';
import { Component } from '../../src/entities/component.entity';
import { MonitorSystem } from '../../src/entities/monitor-system.entity';
import { genMonitorLocation } from './monitor-location';
import { genDailyCalibration } from './daily-calibration';
import { optionalValue } from './util';

type GenDailyTestSummaryConfig = {
  include?: Array<
    | 'monitorLocation'
    | 'reportingPeriod'
    | 'component'
    | 'monitorSystem'
    | 'dailyCalibrations'
  >;
  dailyCalibrationAmount?: number;
};

// Using RepoType for workspace/non-workspace
export const genDailyTestSummary = <RepoType>(
  amount = 1,
  config?: GenDailyTestSummaryConfig,
): RepoType[] => {
  const testSummaries: RepoType[] = [];
  for (let testSummary = 0; testSummary < amount; testSummary++) {
    testSummaries.push(({
      id: faker.datatype.string(),
      reportingPeriodId: faker.datatype.number(),
      monitoringLocationId: faker.datatype.string(),
      componentId: optionalValue(faker.datatype.string()),
      date: faker.datatype.datetime(),
      hour: faker.datatype.number(),
      minute: optionalValue(faker.datatype.number()),
      testTypeCode: faker.datatype.string(),
      testResultCode: faker.datatype.string(),
      calcTestResultCode: optionalValue(faker.datatype.string()),
      userId: faker.datatype.string(),
      addDate: faker.datatype.datetime(),
      updateDate: faker.datatype.datetime(),
      spanScaleCode: faker.datatype.string(),
      monitoringSystemId: faker.datatype.string(),
      // Replace new Model() with genModel() as created/needed
      monitorLocation:
        config?.include?.includes('monitorLocation') === true
          ? genMonitorLocation()[0]
          : undefined,
      reportingPeriod:
        config?.include?.includes('reportingPeriod') === true
          ? new ReportingPeriod()
          : undefined,
      component:
        config?.include?.includes('component') === true
          ? new Component()
          : undefined,
      monitorSystem:
        config?.include?.includes('monitorSystem') === true
          ? new MonitorSystem()
          : undefined,
      dailyCalibrations:
        config?.include?.includes('dailyCalibrations') === true
          ? genDailyCalibration(config?.dailyCalibrationAmount ?? 1)
          : undefined,
    } as unknown) as RepoType);
  }

  return testSummaries;
};
