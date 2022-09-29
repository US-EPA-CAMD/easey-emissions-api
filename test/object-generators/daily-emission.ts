import { faker } from '@faker-js/faker';
import { optionalValue } from './util';
import { genReportingPeriod } from './reporting-period';
import { genMonitorLocation } from './monitor-location';
import { genDailyFuel } from './daily-fuel';

type GenDailyEmissionConfig = {
  include?: Array<'reportingPeriod' | 'monitorLocation' | 'dailyFuelData'>;
  dailyFuelDataAmount?: number;
};

export const genDailyEmission = <RepoType>(
  amount = 1,
  config?: GenDailyEmissionConfig,
) => {
  const dailyEmissions: RepoType[] = [];

  for (let dailyEmission = 0; dailyEmission < amount; dailyEmission++) {
    dailyEmissions.push(({
      id: faker.datatype.string(),
      reportingPeriodId: faker.datatype.number(),
      monitoringLocationId: faker.datatype.string(),
      parameterCode: faker.datatype.string(),
      date: faker.date.soon(),
      totalDailyEmissions: optionalValue(faker.datatype.number()),
      adjustedDailyEmissions: optionalValue(faker.datatype.number()),
      sorbentRelatedMassEmissions: optionalValue(faker.datatype.number()),
      userId: optionalValue(faker.datatype.string()),
      addDate: optionalValue(faker.date.soon()),
      updateDate: optionalValue(faker.date.soon()),
      unadjustedDailyEmissions: optionalValue(faker.datatype.number()),
      totalCarbonBurned: optionalValue(faker.datatype.number()),
      calcTotalDailyEmissions: optionalValue(faker.datatype.number()),
      calcTotalOpTime: optionalValue(faker.datatype.number()),
      reportingPeriod:
        config?.include?.includes('reportingPeriod') === true
          ? genReportingPeriod()[0]
          : undefined,
      monitorLocation:
        config?.include?.includes('monitorLocation') === true
          ? genMonitorLocation()[0]
          : undefined,
      dailyFuelData:
        config?.include?.includes('dailyFuelData') === true
          ? genDailyFuel(config?.dailyFuelDataAmount)
          : undefined,
    } as unknown) as RepoType);
  }

  return dailyEmissions;
};
