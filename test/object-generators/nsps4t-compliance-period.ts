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
      id: faker.datatype.string(),
      nsps4tSumId: faker.datatype.string(),
      beginYear: optionalValue(faker.datatype.number()),
      beginMonth: optionalValue(faker.datatype.number()),
      endYear: optionalValue(faker.datatype.number()),
      endMonth: optionalValue(faker.datatype.number()),
      averageCo2EmissionRate: optionalValue(faker.datatype.number()),
      co2EmissionRateUomCode: optionalValue(faker.datatype.string()),
      percentValidOpHours: optionalValue(faker.datatype.number()),
      violationOfCo2StandardIndicator: optionalValue(faker.datatype.number()),
      violationOfCo2StandardComment: optionalValue(faker.datatype.string()),
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

  return nsps4tCompliancePeriods;
};
