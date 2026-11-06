import { faker } from '@faker-js/faker';
import { genMonitorLocation } from './monitor-location';
import { genReportingPeriod } from './reporting-period';
import { genNsps4tSummary } from './nsps4t-summary';
import { optionalValue } from './util';

type GenNsps4tCompliancePeriodConfig = {
  include?: Array<'monitorLocation' | 'reportingPeriod' | 'nsps4tSummary'>;
};

export const genNsps4tCompliancePeriod = <RepoType>(
  amount = 1,
  config?: GenNsps4tCompliancePeriodConfig,
): RepoType[] => {
  const nsps4tCompliancePeriods: RepoType[] = [];

  for (
    let nsps4tCompliancePeriod = 0;
    nsps4tCompliancePeriod < amount;
    nsps4tCompliancePeriod++
  ) {
    nsps4tCompliancePeriods.push({
      id: faker.string.sample(),
      nsps4tSumId: faker.string.sample(),
      beginYear: optionalValue(faker.number.int()),
      beginMonth: optionalValue(faker.number.int()),
      endYear: optionalValue(faker.number.int()),
      endMonth: optionalValue(faker.number.int()),
      averageCo2EmissionRate: optionalValue(faker.number.int()),
      co2EmissionRateUomCode: optionalValue(faker.string.sample()),
      percentValidOpHours: optionalValue(faker.number.int()),
      violationOfCo2StandardIndicator: optionalValue(faker.number.int()),
      violationOfCo2StandardComment: optionalValue(faker.string.sample()),
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

  return nsps4tCompliancePeriods;
};
