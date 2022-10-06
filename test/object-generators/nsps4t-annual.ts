import { faker } from '@faker-js/faker';
import { genMonitorLocation } from './monitor-location';
import { genReportingPeriod } from './reporting-period';
import { genNsps4tSummary } from './nsps4t-summary';
import { optionalValue } from './util';

type GenNsps4tAnnualConfig = {
  include?: Array<'monitorLocation' | 'reportingPeriod' | 'nsps4tSummary'>;
};

export const genNsps4tAnnual = <RepoType>(
  amount = 1,
  config?: GenNsps4tAnnualConfig,
): RepoType[] => {
  const nsps4tAnnuals: RepoType[] = [];

  for (let nsps4tAnnual = 0; nsps4tAnnual < amount; nsps4tAnnual++) {
    nsps4tAnnuals.push({
      id: faker.datatype.string(),
      nsps4tSumId: faker.datatype.string(),
      annualEnergySold: optionalValue(faker.datatype.number()),
      annualEnergySoldTypeCode: optionalValue(faker.datatype.string()),
      annualPotentialElectricOutput: optionalValue(faker.datatype.number()),
      monitoringLocationId: faker.datatype.string(),
      reportingPeriodId: faker.datatype.number(),
      userId: faker.datatype.string(),
      addDate: faker.date.soon(),
      updateDate: optionalValue(faker.date.soon()),
      monitorLocation: config?.include.includes('monitorLocation')
        ? genMonitorLocation()[0]
        : undefined,
      reportingPeriod: config?.include.includes('reportingPeriod')
        ? genReportingPeriod()[0]
        : undefined,
      nsps4tSummary: config?.include.includes('nsps4tSummary')
        ? genNsps4tSummary()[0]
        : undefined,
    } as RepoType);
  }

  return nsps4tAnnuals;
};
