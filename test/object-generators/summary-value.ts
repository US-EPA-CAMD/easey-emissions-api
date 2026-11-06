import { faker } from '@faker-js/faker';
import { genMonitorLocation } from './monitor-location';
import { genReportingPeriod } from './reporting-period';

type GenSummaryValueConfig = {
  include?: Array<'monitorLocation' | 'reportingPeriod'>;
};

export const genSummaryValue = <RepoType>(
  amount = 1,
  config?: GenSummaryValueConfig,
) => {
  const summaryValues: RepoType[] = [];

  for (let i = 0; i < amount; i++) {
    summaryValues.push(({
      id: faker.string.sample(),
      reportingPeriodId: faker.string.sample(),
      monitoringLocationId: faker.string.sample(),
      parameterCode: faker.string.sample(),
      currentReportingPeriodTotal: faker.number.int(),
      calcCurrentRptPeriodTotal: faker.number.int(),
      ozoneSeasonToDateTotal: faker.number.int(),
      calcOsTotal: faker.number.int(),
      yearToDateTotal: faker.number.int(),
      calcYearTotal: faker.number.int(),
      userId: faker.string.sample(),
      addDate: faker.date.anytime(),
      updateDate: faker.date.anytime(),
      monitorLocation: config?.include?.includes('monitorLocation')
        ? genMonitorLocation()[0]
        : undefined,
      reportingPeriod: config?.include?.includes('reportingPeriod')
        ? genReportingPeriod()[0]
        : undefined,
    } as unknown) as RepoType);
  }

  return summaryValues;
};
