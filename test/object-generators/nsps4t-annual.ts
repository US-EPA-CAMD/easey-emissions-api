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
      id: faker.string.sample(),
      nsps4tSumId: faker.string.sample(),
      annualEnergySold: optionalValue(faker.number.int()),
      annualEnergySoldTypeCode: optionalValue(faker.string.sample()),
      annualPotentialElectricOutput: optionalValue(faker.number.int()),
      monitoringLocationId: faker.string.sample(),
      reportingPeriodId: faker.number.int(),
      userId: faker.string.sample(),
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
