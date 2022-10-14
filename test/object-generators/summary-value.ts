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
      id: faker.datatype.string(),
      reportingPeriodId: faker.datatype.string(),
      monitoringLocationId: faker.datatype.string(),
      parameterCode: faker.datatype.string(),
      currentReportingPeriodTotal: faker.datatype.number(),
      calcCurrentRptPeriodTotal: faker.datatype.number(),
      ozoneSeasonToDateTotal: faker.datatype.number(),
      calcOsTotal: faker.datatype.number(),
      yearToDateTotal: faker.datatype.number(),
      calcYearTotal: faker.datatype.number(),
      userId: faker.datatype.string(),
      addDate: faker.datatype.datetime(),
      updateDate: faker.datatype.datetime(),
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
