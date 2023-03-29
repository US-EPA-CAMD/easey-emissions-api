import { faker } from '@faker-js/faker';
import { genMonitorLocation } from './monitor-location';
import { genReportingPeriod } from './reporting-period';
import { optionalValue } from './util';
import { genNsps4tCompliancePeriod } from './nsps4t-compliance-period';
import { genNsps4tAnnual } from './nsps4t-annual';

type GenNsps4tSummaryConfig = {
  include?: Array<
    | 'monitorLocation'
    | 'reportingPeriod'
    | 'nsps4tAnnualData'
    | 'nsps4tCompliancePeriodData'
  >;
  nsps4tCompliancePeriodDataAmount?: number;
  nsps4tAnnualDataAmount?: number;
};

export const genNsps4tSummary = <RepoType>(
  amount = 1,
  config?: GenNsps4tSummaryConfig,
): RepoType[] => {
  const nsps4tSummaryRecords: RepoType[] = [];

  for (let nsps4tSummary = 0; nsps4tSummary < amount; nsps4tSummary++) {
    nsps4tSummaryRecords.push({
      id: faker.datatype.string(),
      co2EmissionStandardCode: optionalValue(faker.datatype.string()),
      modusValue: optionalValue(faker.datatype.number()),
      modusUomCode: optionalValue(faker.datatype.string()),
      electricalLoadCode: optionalValue(faker.datatype.string()),
      noCompliancePeriodEndedIndicator: optionalValue(faker.datatype.number()),
      noCompliancePeriodEndedComment: faker.datatype.string(),
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
        nsps4tAnnualData: config?.include.includes('nsps4tAnnualData')
        ? genNsps4tAnnual(config?.nsps4tAnnualDataAmount)
        : undefined,
      nsps4tCompliancePeriodData: config?.include.includes(
        'nsps4tCompliancePeriodData',
      )
        ? genNsps4tCompliancePeriod(config?.nsps4tCompliancePeriodDataAmount)
        : undefined,
    } as RepoType);
  }

  return nsps4tSummaryRecords;
};
